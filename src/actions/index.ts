import { Dispatch, bindActionCreators } from 'redux';
import dataSourceManager from '../dataSources/DataSourceManager';
import { IFilesStore, IItem, IBreadcrumb, ISetActions, IColumn } from '../interfaces';

export const enum TypeKeys {
  UPDATE_ITEMS = 'UPDATE_ITEMS',
  REPORT_STATUS = 'REPORT_STATUS',
  REPORT_ERROR = 'REPORT_ERROR'
}

export type ActionTypes =
  IUpdateItemsAction |
  IReportStatusAction |
  IReportErrorAction;

export interface IUpdateItemsAction {
  breadcrumbs: IBreadcrumb[];
  columns: IColumn[];
  items: IItem[];
  setKey: string;
  type: TypeKeys.UPDATE_ITEMS;
}

export const updateItems = (
  setKey: string,
  items: IItem[],
  columns: IColumn[],
  breadcrumbs: IBreadcrumb[]
): IUpdateItemsAction => ({
  type: TypeKeys.UPDATE_ITEMS,
  setKey,
  items,
  columns,
  breadcrumbs
});

export interface IReportStatusAction {
  type: TypeKeys.REPORT_STATUS;
  message: string;
}

export const reportStatus = (message: string): IReportStatusAction => ({
  type: TypeKeys.REPORT_STATUS,
  message
});

export interface IReportErrorAction {
  type: TypeKeys.REPORT_ERROR;
  error: Error;
}

export const reportError = (error: Error): IReportErrorAction => ({
  type: TypeKeys.REPORT_ERROR,
  error
});

export const openSet = (setKey: string) => {
  return (dispatch: Dispatch<IFilesStore>) => {

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
      }
    );
  };
};
