import { Dispatch } from 'redux';
import { IFilesStore, IItem, ICommandContext } from './configureStore';
import dataSourceManager from './dataSources/DataSourceManager';

export const getItems = (setKey: string) => {
  return (dispatch: Dispatch<IFilesStore>, getState: () => IFilesStore) => {
    /* let state = getState(); */
    dispatch({
      type: 'SET_LOADING',
      data: true
    });

    dataSourceManager.open(
      setKey,
      dispatch
    );
  }
};

export const setSelectedItems = (items: IItem[]) => ({
  type: 'SET_SELECTION',
  data: items
});

export const executeCommand = (key: string, context: ICommandContext) => {
  switch (key) {
    case 'new':
      return (dispatch: Dispatch<IFilesStore>) => {
        dataSourceManager.getDataSource().createItem(
          context.setKey,
          (item) => {
            dataSourceManager.invalidateSet(context.setKey);
          },
          () => {}
        );
      }
    case 'rename':
      return (dispatch: Dispatch<IFilesStore>) => {
        dataSourceManager.getDataSource().renameItem(
          context.setKey,
          context.selectedItems[0].key,
          'new name',
          (item) => {
            dataSourceManager.invalidateSet(context.setKey);
          },
          () => {}
        );
      }
    default:
      return {};
  }
}

