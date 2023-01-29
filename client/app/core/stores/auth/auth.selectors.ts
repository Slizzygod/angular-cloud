import { createSelector } from '@ngrx/store';

import { selectAuthState } from '../../core.state';
import { AuthState } from './auth.models';

export const selectAuth = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

/**
 * Returns true if the user is authenticated
 */
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const getAuthenticatedUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

/**
 * Returns the authentication error
 */
export const getAuthenticationError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

/**
 * Returns true if the authentication request is loading.
 */
export const isAuthenticationLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

/**
 * Returns the sign out error
 */
export const getSignOutError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

/**
 * Returns true if the user need 2step
 */
export const selectIsTwoStepEnabled = createSelector(
  selectAuthState,
  (state: AuthState) => state.isTwoStepEnabled
);
