import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { selectRefreshToken, selectToken } from '../../store/auth/auth.selectors';

function runInterceptor(token: string | null) {
  let capturedReq!: HttpRequest<unknown>;
  const next: HttpHandlerFn = (req) => {
    capturedReq = req;
    return of({} as any);
  };

  TestBed.configureTestingModule({
    providers: [
      provideMockStore({
        selectors: [
          { selector: selectToken, value: token },
          { selector: selectRefreshToken, value: 'mock-refresh' }
        ]
      })
    ]
  });

  const req = new HttpRequest('GET', '/api/test');
  TestBed.runInInjectionContext(() => authInterceptor(req, next)).subscribe();

  return capturedReq;
}

describe('authInterceptor', () => {
  // MockStore overrides MemoizedSelectors globally; reset so later specs that call selectors with plain state still work.
  afterEach(() => {
    try {
      TestBed.inject(MockStore).resetSelectors();
    } catch {
      /* noop */
    }
    TestBed.resetTestingModule();
  });

  it('attaches Authorization header when token is present', () => {
    const req = runInterceptor('my-jwt-token');
    expect(req.headers.get('Authorization')).toBe('Bearer my-jwt-token');
  });

  it('does not attach Authorization header when token is null', () => {
    const req = runInterceptor(null);
    expect(req.headers.get('Authorization')).toBeNull();
  });

  it('does not mutate the original request object', () => {
    const original = new HttpRequest('GET', '/api/test');
    let passedReq!: HttpRequest<unknown>;
    const next: HttpHandlerFn = (req) => {
      passedReq = req;
      return of({} as any);
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectToken, value: 'token' },
            { selector: selectRefreshToken, value: 'mock-refresh' }
          ]
        })
      ]
    });

    TestBed.runInInjectionContext(() => authInterceptor(original, next)).subscribe();
    expect(passedReq).not.toBe(original);
  });
});
