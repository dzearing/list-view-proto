import { StoreEnhancer, Store, createStore, compose, applyMiddleware } from 'redux';
import { DevTools } from './containers/DevTools';
import { rootReducer, DEFAULT_STATE } from './reducers';
import thunk from 'redux-thunk';
import { IFilesStore, IFilesStoreConfiguration } from './interfaces';

export function configureStore(config?: IFilesStoreConfiguration): Store<IFilesStore> {
  let initialState = DEFAULT_STATE;
  if (config) {
    if (config.setKey) {
      initialState.setKey = config.setKey;
    }
    if (config.topCommands) {
      initialState.commands = config.topCommands;
    }
  }
  return createStore<IFilesStore>(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      DevTools.instrument()
    ) as StoreEnhancer<IFilesStore>
  );
}
