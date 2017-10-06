import { IItem, IBaseAction, IFilesStore } from '../configureStore';

const reducers = {
  'UPDATE_ITEMS': updateItems,
  'SET_LOADING': setLoading,
  'SET_SELECTION': setSelection
};

function updateItems(state: IFilesStore, action: IBaseAction<{ setKey: string, items: IItem[] }>): IFilesStore {
  const items = action.data && action.data.items || [];
  const breadcrumbs = [
    {
      key: 'root',
      text: items ? items[0].text : 'root'
    }
  ];
  return {
    ...state,
    isLoading: false,
    items: items,
    breadcrumbs: breadcrumbs
  };
}

function setLoading(state: IFilesStore, action: IBaseAction<boolean>): IFilesStore {
  return {
    ...state,
    isLoading: true
  };
}

function setSelection(state: IFilesStore, action: IBaseAction<IItem[]>): IFilesStore {
  const items = action.data || [];
  return {
    ...state,
    selectedItems: items
  };
}

export default reducers;