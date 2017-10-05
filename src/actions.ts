import { Dispatch } from 'redux';
import { IItem, IFilesStore } from './configureStore';
import dataSourceManager from './dataSources/DataSourceManager';

export const updateItems = (setKey: string, items: IItem[]) => ({
  type: 'UPDATE_ITEMS',
  data: {
    setKey,
    items
  }
});

export const getItems = (setKey: string) => {
  return (dispatch: Dispatch<IFilesStore>) => {

    dataSourceManager.open(
      setKey || '',
      (items) => dispatch(updateItems(setKey, items))
    );
  };
};
