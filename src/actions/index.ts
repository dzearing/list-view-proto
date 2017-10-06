import { Dispatch, bindActionCreators } from 'redux';
import dataSourceManager from '../dataSources/DataSourceManager';
import { IFilesStore, IItem, IBreadcrumb, ISetActions, IColumn, ICommandContext } from '../interfaces';

export const enum TypeKeys {
  UPDATE_ITEMS = 'UPDATE_ITEMS',
  REPORT_STATUS = 'REPORT_STATUS',
  REPORT_ERROR = 'REPORT_ERROR',
  SET_LOADING = 'SET_LOADING',
  SET_SELECTION = 'SET_SELECTION'
}

export type ActionTypes =
  IUpdateItemsAction |
  IReportStatusAction |
  ISetLoadingAction |
  ISetSelectionAction |
  IReportErrorAction;

export interface IUpdateItemsAction {
  breadcrumbs: IBreadcrumb[];
  columns: IColumn[];
  items: IItem[];
  setKey: string;
  type: TypeKeys.UPDATE_ITEMS;
}

export interface ISetLoadingAction {
  type: TypeKeys.SET_LOADING;
}

export interface ISetSelectionAction {
  type: TypeKeys.SET_SELECTION;
  data: IItem[];
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

export const setSelectedItems = (
  selectedItems: IItem[]
): ISetSelectionAction => ({
  type: TypeKeys.SET_SELECTION,
  data: selectedItems
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
    dispatch({
      type: 'SET_LOADING',
      data: true
    });

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

export const executeCommand = (key: string, context: ICommandContext) => {
  switch (key) {
    case 'new':
      return (dispatch: Dispatch<IFilesStore>) => {
        let createItem = dataSourceManager.getDataSource().createItem;
        if (createItem) {
          createItem(
            context.setKey,
            (item) => {
              dataSourceManager.invalidateSet(context.setKey);
            },
            () => {}
          );
        }
      }
    case 'rename':
      return (dispatch: Dispatch<IFilesStore>) => {
        let renameItem = dataSourceManager.getDataSource().renameItem;
        if (renameItem) {
          renameItem(
            context.setKey,
            context.selectedItems[0].key,
            'new name',
            (item) => {
              dataSourceManager.invalidateSet(context.setKey);
            },
            () => {}
          );
        }
      }
    default:
      return {};
  }
}


