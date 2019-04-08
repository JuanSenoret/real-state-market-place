
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../environments/environment';

// nice moment here
// here is our root state, which also includes the route state
export interface AppState {
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
};

export const metaReducers = environment.production ? [] : [storeFreeze];

// !!!here we define our root selectors
export const routerState = createFeatureSelector<AppState, RouterReducerState>('router');
