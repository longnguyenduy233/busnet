import { beforeEach, describe, expect, it } from 'vitest';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthState,
  selectDisplayName,
  selectIsLoggedIn,
  selectRefreshToken,
  selectToken,
  selectUserName
} from './auth.selectors';
import { AuthState } from './auth.state';

/** MockStore#setResult survives TestBed teardown; clear before asserting raw selector behavior. */
function resetAuthSelectorMocks(): void {
  for (const sel of [
    selectAuthState,
    selectToken,
    selectRefreshToken,
    selectUserName,
    selectDisplayName,
    selectAuthLoading,
    selectAuthError,
    selectIsLoggedIn,
  ]) {
    sel.release();
    sel.clearResult();
  }
}

const buildState = (partial: Partial<AuthState>) => ({
  auth: {
    token: null,
    refreshToken: null,
    userName: null,
    displayName: null,
    loading: false,
    error: null,
    ...partial
  } as AuthState
});

describe('auth selectors', () => {
  beforeEach(() => {
    resetAuthSelectorMocks();
  });

  it('selectToken: returns the token', () => {
    expect(selectToken(buildState({ token: 'jwt' }))).toBe('jwt');
  });

  it('selectToken: returns null when not set', () => {
    expect(selectToken(buildState({}))).toBeNull();
  });

  it('selectRefreshToken: returns refresh token when set', () => {
    expect(selectRefreshToken(buildState({ refreshToken: 'rt1' }))).toBe('rt1');
  });

  it('selectRefreshToken: returns null when not set', () => {
    expect(selectRefreshToken(buildState({}))).toBeNull();
  });

  it('selectUserName: returns the userName', () => {
    expect(selectUserName(buildState({ userName: 'admin' }))).toBe('admin');
  });

  it('selectDisplayName: returns the displayName', () => {
    expect(selectDisplayName(buildState({ displayName: 'Administrator' }))).toBe('Administrator');
  });

  it('selectAuthLoading: returns loading flag', () => {
    expect(selectAuthLoading(buildState({ loading: true }))).toBe(true);
    expect(selectAuthLoading(buildState({ loading: false }))).toBe(false);
  });

  it('selectAuthError: returns error string', () => {
    expect(selectAuthError(buildState({ error: 'Login failed' }))).toBe('Login failed');
  });

  it('selectIsLoggedIn: true when token exists', () => {
    expect(selectIsLoggedIn(buildState({ token: 'jwt' }))).toBe(true);
  });

  it('selectIsLoggedIn: false when token is null', () => {
    expect(selectIsLoggedIn(buildState({ token: null }))).toBe(false);
  });

  it('selectIsLoggedIn: false when token is empty string', () => {
    expect(selectIsLoggedIn(buildState({ token: '' }))).toBe(false);
  });
});
