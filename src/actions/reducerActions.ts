import { IItem, IBreadcrumb, IColumn } from '../interfaces';
import { TypeKeys, IUpdateItemsAction, ISetSelectionAction, IReportErrorAction, IReportStatusAction, ISetLoadingAction } from './actionInterfaces';

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

export const reportStatus = (message: string): IReportStatusAction => ({
  type: TypeKeys.REPORT_STATUS,
  message
});

export const reportError = (error: Error): IReportErrorAction => ({
  type: TypeKeys.REPORT_ERROR,
  error
});

export const setLoading = (isLoading: boolean): ISetLoadingAction => ({
  type: TypeKeys.SET_LOADING,
  data: isLoading
});