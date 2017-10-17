import { Dispatch, bindActionCreators } from 'redux';
import dataSourceManager from '../dataSources/DataSourceManager';
import { IFilesStore, ISetActions } from '../interfaces';
import { setLoading, updateItems, reportStatus, reportError } from './reducerActions';

export const openSet = (setKey: string) => {
  return (dispatch: Dispatch<IFilesStore>) => {
    dispatch(setLoading(true));

    dataSourceManager.openSet(
      setKey,
      {
        ...bindActionCreators(
          {
            updateItems,
            reportStatus,
            reportError
          },
          dispatch
        ) as ISetActions
      },
      dispatch
    );
  };
};