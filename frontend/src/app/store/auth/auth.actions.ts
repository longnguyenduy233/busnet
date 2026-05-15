import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ userName: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; refreshToken: string; userName: string; displayName: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const sessionTokensRefreshed = createAction(
  '[Auth] Session tokens refreshed',
  props<{ token: string; refreshToken: string }>()
);

export const logout = createAction('[Auth] Logout');
