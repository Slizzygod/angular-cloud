import { AuthState } from './auth.models';
import { AuthActions, AuthActionTypes } from './auth.actions';
import { User } from '../../models';

export const initialState: AuthState = {
  isAuthenticated: false,
  isTwoStepEnabled: false,
  loading: false
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, loading: true };

    case AuthActionTypes.LOGOUT:
      return { ...state, isAuthenticated: false, isTwoStepEnabled: false, user: undefined };

    case AuthActionTypes.AUTHENTICATE_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload.error.message,
        loading: false
      };

    case AuthActionTypes.AUTHENTICATE_SUCCESS:
      const user: User = action.payload.user;

      // verify user is not null
      if (user === null) {
        return state;
      }

      return {
        ...state,
        isAuthenticated: true,
        error: undefined,
        loading: false,
        user
      };

    case AuthActionTypes.REQUIRED_CONFIRM:
      return { ...state, isTwoStepEnabled: true, loading: false };

    default:
      return state;
  }
}
