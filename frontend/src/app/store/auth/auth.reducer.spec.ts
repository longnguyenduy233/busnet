import { describe, expect, it } from 'vitest';
import { login, loginFailure, loginSuccess, logout, sessionTokensRefreshed } from './auth.actions';
import { authReducer } from './auth.reducer';
import { AuthState } from './auth.state';

const cleanState: AuthState = {
  token: null,
  refreshToken: null,
  userName: null,
  displayName: null,
  loading: false,
  error: null
};

describe('authReducer', () => {
  it('returns the initial state for an unknown action', () => {
    const state = authReducer(cleanState, { type: '@@UNKNOWN' } as any);
    expect(state).toEqual(cleanState);
  });

  it('login: sets loading=true and clears error', () => {
    const state = authReducer(
      { ...cleanState, error: 'old error' },
      login({ userName: 'admin', password: 'pass' })
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginSuccess: stores token, userName, displayName and clears loading/error', () => {
    const state = authReducer(
      { ...cleanState, loading: true },
      loginSuccess({
        token: 'jwt',
        refreshToken: 'rt',
        userName: 'admin',
        displayName: 'Administrator'
      })
    );
    expect(state.token).toBe('jwt');
    expect(state.refreshToken).toBe('rt');
    expect(state.userName).toBe('admin');
    expect(state.displayName).toBe('Administrator');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('loginFailure: stores error and clears loading', () => {
    const state = authReducer(
      { ...cleanState, loading: true },
      loginFailure({ error: 'Invalid credentials' })
    );
    expect(state.error).toBe('Invalid credentials');
    expect(state.loading).toBe(false);
    expect(state.token).toBeNull();
  });

  it('logout: resets all fields to null/false', () => {
    const loggedIn: AuthState = {
      token: 'jwt',
      refreshToken: 'rt',
      userName: 'admin',
      displayName: 'Administrator',
      loading: false,
      error: null
    };
    const state = authReducer(loggedIn, logout());
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.userName).toBeNull();
    expect(state.displayName).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sessionTokensRefreshed: rotates access + refresh tokens', () => {
    const loggedIn = {
      ...cleanState,
      token: 'old',
      refreshToken: 'oldRt',
      userName: 'admin',
      displayName: 'Admin'
    };
    const state = authReducer(loggedIn, sessionTokensRefreshed({ token: 'neo', refreshToken: 'neoRt' }));
    expect(state.token).toBe('neo');
    expect(state.refreshToken).toBe('neoRt');
    expect(state.userName).toBe('admin');
  });

  it('loginSuccess: does not mutate the previous state', () => {
    const prev = { ...cleanState };
    authReducer(
      prev,
      loginSuccess({ token: 'jwt', refreshToken: 'rt', userName: 'u', displayName: 'd' })
    );
    expect(prev.token).toBeNull();
  });
});
