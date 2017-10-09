import { StoreEnhancer, Store, createStore, compose, applyMiddleware } from 'redux';
import { DevTools } from './containers/DevTools';
import reducers from './reducers/index';
import thunk from 'redux-thunk';

export interface IColumn { }
export interface IItem {
  key: string;
  text: string;
  facets?: any[];
}

export interface IButton { }
export interface IBreadcrumb { }
// tslint:disable-next-line:no-any
export interface IBaseAction<T = any> {
  type: string;
  data: T;
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
  commands: IButton[];
  errorMessage: string;
  viewType: ViewType;
}

const DEFAULT_STATE = {
  setKey: '',
  viewType: ViewType.List,
  isLoading: false,
  breadcrumbs: [],
  columns: [],
  items: [],
  commands: [
    {
      key: 'new',
      name: 'New',
      iconProps: { iconName: 'Add' },
      items: [
        {
          key: 'newFolder',
          name: 'New folder'
        }
      ]
    },
    {
      key: 'upload',
      name: 'Upload',
      iconProps: { iconName: 'Upload' }
    }
  ],
  errorMessage: ''
};

function reducer(state: IFilesStore = DEFAULT_STATE, action: IBaseAction): IFilesStore {
  let reducerFunction = reducers[action.type];
  if (reducerFunction) {
    return reducerFunction(state, action);
  }
  return state;
}

export function configureStore(): Store<IFilesStore> {
  return createStore<IFilesStore>(
    reducer,
    compose(
      applyMiddleware(thunk),
      DevTools.instrument()
    ) as StoreEnhancer<IFilesStore>
  );
}
