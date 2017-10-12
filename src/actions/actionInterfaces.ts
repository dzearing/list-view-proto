import { IItem, IBreadcrumb, IColumn } from '../interfaces';

export const enum TypeKeys {
  UPDATE_ITEMS = 'UPDATE_ITEMS',
  REPORT_STATUS = 'REPORT_STATUS',
  REPORT_ERROR = 'REPORT_ERROR',
  SET_LOADING = 'SET_LOADING',
  SET_SELECTION = 'SET_SELECTION'
};

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
  data: boolean;
}

export interface ISetSelectionAction {
  type: TypeKeys.SET_SELECTION;
  data: IItem[];
}

export interface IReportErrorAction {
  type: TypeKeys.REPORT_ERROR;
  error: Error;
}

export interface IReportStatusAction {
  type: TypeKeys.REPORT_STATUS;
  message: string;
}
