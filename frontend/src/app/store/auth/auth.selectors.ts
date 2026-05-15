import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(selectAuthState, (s) => s.token);
export const selectRefreshToken = createSelector(selectAuthState, (s) => s.refreshToken);
export const selectUserName = createSelector(selectAuthState, (s) => s.userName);
export const selectDisplayName = createSelector(selectAuthState, (s) => s.displayName);
export const selectAuthLoading = createSelector(selectAuthState, (s) => s.loading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
// Derive from auth slice directly (chaining selectToken broke under Vitest + @ngrx/store 21).
export const selectIsLoggedIn = createSelector(selectAuthState, (s) => !!s.token);
