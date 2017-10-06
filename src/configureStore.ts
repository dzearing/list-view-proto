import { StoreEnhancer, Store, createStore, compose, applyMiddleware } from 'redux';
import { DevTools } from './containers/DevTools';
import { rootReducer } from './reducers';
import thunk from 'redux-thunk';
import { IFilesStore } from './interfaces';

// tslint:disable-next-line:no-any
export interface IBaseAction<T = any> {
  type: string;
  data: T;
}

export function configureStore(): Store<IFilesStore> {
  return createStore<IFilesStore>(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      DevTools.instrument()
    ) as StoreEnhancer<IFilesStore>
  );
}
