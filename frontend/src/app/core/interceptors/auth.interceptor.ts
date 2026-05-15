import {
  HttpBackend,
  HttpClient,
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  from,
  lastValueFrom,
  switchMap,
  take,
  throwError
} from 'rxjs';
import { logout, sessionTokensRefreshed } from '../../store/auth/auth.actions';
import { selectRefreshToken, selectToken } from '../../store/auth/auth.selectors';
import { environment } from '../../../environments/environment';

/** Prevents infinite refresh loops if the replayed HTTP call still yields 401. */
export const AUTH_ALREADY_REFRESHED = new HttpContextToken<boolean>(() => false);

interface RefreshBody {
  token: string;
  refreshToken: string;
}

/**
 * One in-flight `/auth/refresh` for the whole app: concurrent 401s share this Promise
 * (Observable shareReplay can still double-subscribe under tight races; Promise ??= is atomic).
 */
let refreshSingleton: Promise<RefreshBody> | null = null;

function sharedRefresh(
  rawHttp: HttpClient,
  store: Store,
  refreshToken: string
): Promise<RefreshBody> {
  refreshSingleton ??= (async () => {
    try {
      const body = await lastValueFrom(
        rawHttp.post<RefreshBody>(`${environment.apiUrl}/auth/refresh`, {
          refreshToken
        })
      );
      store.dispatch(
        sessionTokensRefreshed({ token: body.token, refreshToken: body.refreshToken })
      );
      return body;
    } catch (refErr) {
      store.dispatch(logout());
      throw refErr;
    } finally {
      refreshSingleton = null;
    }
  })();
  return refreshSingleton;
}

/** Vitest: reset singleton between examples (only import in spec). */
export function resetAuthRefreshSingletonForTests(): void {
  refreshSingleton = null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const rawHttp = new HttpClient(inject(HttpBackend));

  const skipBearer =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh');

  return combineLatest([store.select(selectToken), store.select(selectRefreshToken)]).pipe(
    take(1),
    switchMap(([accessToken, refreshToken]) => {
      const outgoing =
        skipBearer || !accessToken
          ? req
          : req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });

      return next(outgoing).pipe(
        catchError((error: unknown) => {
          if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
            return throwError(() => error);
          }

          const isLoginAttempt = outgoing.url.includes('/auth/login');
          const isRefreshCall = outgoing.url.includes('/auth/refresh');

          // Wrong password → do not purge session or retry with refresh.
          if (isLoginAttempt) {
            return throwError(() => error);
          }

          // Refresh JWT rejected / expired → end session server already returned 401.
          if (isRefreshCall) {
            store.dispatch(logout());
            return throwError(() => error);
          }

          // Retried once with a freshly minted access token — treat as logout.
          if (req.context.get(AUTH_ALREADY_REFRESHED)) {
            store.dispatch(logout());
            return throwError(() => error);
          }

          if (!refreshToken) {
            store.dispatch(logout());
            return throwError(() => error);
          }

          return from(sharedRefresh(rawHttp, store, refreshToken)).pipe(
            switchMap((body) =>
              next(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${body.token}` },
                  context: req.context.set(AUTH_ALREADY_REFRESHED, true)
                })
              )
            ),
            catchError((e) => throwError(() => e))
          );
        })
      );
    })
  );
};
