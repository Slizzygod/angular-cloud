import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { AppState } from '../core.state';
import { LocalStorageService } from './local-storage.service';

export function initStateFromLocalStorage(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  const localStorage = new LocalStorageService();

  return function(state, action) {
    const newState = reducer(state, action);

    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      return { ...newState, ...localStorage.loadInitialState() };
    }

    return newState;
  };
}
