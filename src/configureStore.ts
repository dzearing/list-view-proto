import { StoreEnhancer, Store, createStore, compose, applyMiddleware } from 'redux';
import { DevTools } from './containers/DevTools';
import reducers from './reducers/index';
import thunk from 'redux-thunk';
import { IContextualMenuItem } from 'office-ui-fabric-react';
import topCommands from './defaults/topCommands';

export interface IColumn { }
export interface IItem {
  key: string;
  text: string;
  facets?: any[];
}

export interface ICommandContext {
    setKey: string;
    selectedItems: IItem[];
}

export interface ICommand extends IContextualMenuItem {
  isAvailable?: (context: ICommandContext) => boolean;
}

export interface IBreadcrumb { }
// tslint:disable-next-line:no-any
export interface IBaseAction<T = any> {
  type: string;
  data?: T;
}
export enum ViewType {
  CompactList = 1,
  List = 2,
  Grid = 3
}

export interface IFilesStore {
  setKey: string;
  isLoading: boolean;
  breadcrumbs: IBreadcrumb[];
  columns: IColumn[];
  items: IItem[];
  commands: ICommand[];
  errorMessage: string;
  viewType: ViewType;
  selectedItems: IItem[];
}

export interface IFilesStoreConfiguration {
  topCommands?: ICommand[];
  setKey?: string;
}

const DEFAULT_STATE = {
  setKey: 'od:root',
  viewType: ViewType.List,
  isLoading: false,
  breadcrumbs: [],
  columns: [],
  items: [],
  selectedItems: [],
  commands: topCommands,
  errorMessage: ''
};

function reducer(state: IFilesStore, action: IBaseAction): IFilesStore {
  let reducerFunction = reducers[action.type];
  if (reducerFunction) {
    return reducerFunction(state, action);
  }
  return state;
}

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
    reducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      DevTools.instrument()
    ) as StoreEnhancer<IFilesStore>
  );
}
