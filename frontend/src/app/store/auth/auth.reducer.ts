import { createReducer, on } from '@ngrx/store';
import { login, loginFailure, loginSuccess, logout, sessionTokensRefreshed } from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

export const authReducer = createReducer<AuthState>(
  initialAuthState,
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { token, refreshToken, userName, displayName }) => ({
    ...state,
    loading: false,
    token,
    refreshToken,
    userName,
    displayName,
    error: null
  })),
  on(sessionTokensRefreshed, (state, { token, refreshToken }) => ({
    ...state,
    token,
    refreshToken,
    error: null
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(logout, () => ({
    token: null,
    refreshToken: null,
    userName: null,
    displayName: null,
    loading: false,
    error: null
  }))
);
