import { Store, createStore, compose, applyMiddleware } from 'redux';
import { DevTools } from './containers/DevTools';
import reducers from './reducers/index';
import thunk from 'redux-thunk';

export interface IColumn { }
export interface IItem { }
export interface IButton { }
export interface IBreadcrumb { }

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

function reducer(state: IFilesStore, action: { type: string, data?: any }): IFilesStore {
    let reducerFunction = reducers[action.type];
    if (reducerFunction) {
        return reducerFunction(state, action.data);
    }
    return state;
}

export function configureStore(): Store<IFilesStore> {
  const enhancer = compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  );

  return createStore<IFilesStore>(
    reducer,
    {
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
    },
    enhancer
  );
}

