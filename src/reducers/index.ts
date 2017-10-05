import { IItem, IBaseAction, IFilesStore } from '../configureStore';

const reducers = {
  'UPDATE_ITEMS': updateItems
};

function updateItems(state: IFilesStore, action: IBaseAction<{ setKey: string, items: IItem[] }>): IFilesStore {
  const items = action.data.items;
  const breadcrumbs = [
    {
      key: 'root',
      text: items[0].text
    }
  ];
  return {
    ...state,
    isLoading: false,
    items: items,
    breadcrumbs: breadcrumbs
  };
}

export default reducers;