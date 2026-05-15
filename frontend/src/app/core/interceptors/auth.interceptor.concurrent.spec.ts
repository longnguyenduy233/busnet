import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  AUTH_ALREADY_REFRESHED,
  authInterceptor,
  resetAuthRefreshSingletonForTests
} from './auth.interceptor';
import { selectRefreshToken, selectToken } from '../../store/auth/auth.selectors';
import { environment } from '../../../environments/environment';

/**
 * Validates single-flight `/auth/refresh`: two parallel 401 GETs trigger one POST refresh only.
 */
describe('authInterceptor concurrent refresh', () => {
  const baseUrl = `${environment.apiUrl}`;
  /** Empty paged buses body so Client JSON parse succeeds after retry. */
  const emptyPagedBuses = {
    items: [] as [],
    totalCount: 0,
    page: 1,
    pageSize: 500
  };

  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    resetAuthRefreshSingletonForTests();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideMockStore({
          selectors: [
            { selector: selectToken, value: 'access-stale' },
            { selector: selectRefreshToken, value: 'refresh-token-1' }
          ]
        })
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpMock.verify({ ignoreCancelled: true });
    } finally {
      try {
        TestBed.inject(MockStore).resetSelectors();
      } catch {
        /* noop */
      }
      TestBed.resetTestingModule();
      resetAuthRefreshSingletonForTests();
    }
  });

  it('issues exactly one POST /auth/refresh when two API calls hit 401 at once', async () => {
    const urlA = `${baseUrl}/buses?page=1&pageSize=10`;
    const urlB = `${baseUrl}/routes?page=1&pageSize=10`;

    const resA = firstValueFrom(httpClient.get(urlA));
    const resB = firstValueFrom(httpClient.get(urlB));

    const initialGets = httpMock.match(
      (r) =>
        r.method === 'GET' &&
        r.headers.get('Authorization') === 'Bearer access-stale' &&
        (r.url.includes('/buses') || r.url.includes('/routes'))
    );
    expect(initialGets.length).toBe(2);

    initialGets.forEach((t) => t.flush('unauthorized', { status: 401, statusText: 'Unauthorized' }));

    const refreshes = httpMock.match((r) => r.method === 'POST' && r.url.includes('/auth/refresh'));

    expect(refreshes.length).toBe(1);
    refreshes[0]!.flush({
      token: 'access-renewed',
      refreshToken: 'refresh-renewed'
    });

    // Let the shared refresh Promise resolve and schedule the two replayed GETs.
    await Promise.resolve();
    await Promise.resolve();

    const retries = httpMock.match(
      (r) =>
        r.method === 'GET' &&
        r.headers.get('Authorization') === 'Bearer access-renewed' &&
        r.context.get(AUTH_ALREADY_REFRESHED) === true
    );
    expect(retries.length).toBe(2);
    expect(new Set(retries.map((t) => t.request.url))).toEqual(new Set([urlA, urlB]));

    retries.forEach((t) => t.flush(emptyPagedBuses));

    const [bodyA, bodyB] = await Promise.all([resA, resB]);
    expect(bodyA).toEqual(emptyPagedBuses);
    expect(bodyB).toEqual(emptyPagedBuses);
  });

  it('failed refresh clears singleton so another 401 may attempt refresh again', async () => {
    const url = `${baseUrl}/vehicles?page=1`;

    const first = firstValueFrom(httpClient.get(url));
    httpMock.expectOne(url).flush('nope', { status: 401, statusText: 'Unauthorized' });
    const badRefresh = httpMock.expectOne((r) => r.url.includes('/auth/refresh'));
    badRefresh.flush('invalid', { status: 401, statusText: 'Unauthorized' });

    await expect(first).rejects.toBeInstanceOf(HttpErrorResponse);

    const second = firstValueFrom(httpClient.get(url));
    httpMock.expectOne(url).flush('again', { status: 401, statusText: 'Unauthorized' });

    const secondRefresh = httpMock.expectOne((r) => r.url.includes('/auth/refresh'));
    secondRefresh.flush({
      token: 'ok-access',
      refreshToken: 'ok-refresh'
    });

    await Promise.resolve();
    await Promise.resolve();

    const retry = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url.includes(`${baseUrl}/vehicles`)
    );
    expect(retry.request.headers.get('Authorization')).toBe('Bearer ok-access');
    retry.flush(emptyPagedBuses);

    await expect(second).resolves.toEqual(emptyPagedBuses);
  });
});
