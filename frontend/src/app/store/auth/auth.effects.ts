import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { login, loginFailure, loginSuccess, logout, sessionTokensRefreshed } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ userName, password }) =>
        this.authService.login({ userName, password }).pipe(
          map((res) =>
            loginSuccess({
              token: res.token,
              refreshToken: res.refreshToken,
              userName: res.userName,
              displayName: res.displayName
            })
          ),
          catchError((err) =>
            of(loginFailure({ error: err.error?.message ?? 'Login failed' }))
          )
        )
      )
    )
  );

  /** Identity fields + tokens after credential login. */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ token, refreshToken, userName, displayName }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userName', userName);
          localStorage.setItem('displayName', displayName);
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  /** Rotated tokens from refresh flow (interceptors already updated memory; persist for reload). */
  sessionTokensPersist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(sessionTokensRefreshed),
        tap(({ token, refreshToken }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userName');
          localStorage.removeItem('displayName');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
