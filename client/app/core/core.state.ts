import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { AuthState, authReducer } from '@app/core/stores/auth';
import { initStateFromLocalStorage } from './services';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [ initStateFromLocalStorage ];

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export interface AppState {
  auth: AuthState;
}
