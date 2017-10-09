import { updateItems, reportStatus, reportError } from '../actions';

export type IItemType =
  'folder' |
  'sharedFolder' |
  'file';

export interface IFacet {
  type: string;
}

export interface ITextFacet extends IFacet {
  text: string;
}

export interface INameLinkFacet { }

export interface ILinkFacet {
  href: string;
}

export interface IDateFacet {
  date: Date;
}

export type IFacetDictionary = { [fieldName: string]: IFacet };

export interface IItem {
  key: string;
  displayName: string;
  itemType: string;
  childCount?: number;
  facets?: IFacetDictionary;
}

export interface ISetActions {
  updateItems: typeof updateItems;
  reportStatus: typeof reportStatus;
  reportError: typeof reportError;
}

export interface IOpenSetResponse {
  getMoreItems: () => void;
  closeSet: () => void;
}

export interface IDataSource {
  openSet: (setKey: string, actions: ISetActions) => IOpenSetResponse;
}
export interface IColumn { }
export interface IButton { }
export interface IBreadcrumb {
  key: string;
  text: string;
  href?: string;
}

export const enum ViewType {
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
