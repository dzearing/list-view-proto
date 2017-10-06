import { updateItems, reportStatus, reportError } from '../actions';
import { IContextualMenuItem } from 'office-ui-fabric-react';

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
  itemType?: string;
  childCount?: number;
  facets?: IFacetDictionary;
}

export interface ICommandContext {
    setKey: string;
    selectedItems: IItem[];
}

export interface ICommand extends IContextualMenuItem {
  isAvailable?: (context: ICommandContext) => boolean;
}

export interface IFilesStoreConfiguration {
  topCommands?: ICommand[];
  setKey?: string;
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
  createItem?: (setKey: string, onComplete: (item: IItem) => any, onError: () => void) => void;
  renameItem?: (setKey: string, itemKey: string, newName: string, onComplete: (item: IItem) => any, onError: () => void) => void;
  refreshSet?: (setKey: string, onComplete: (items: IItem[]) => any, onError: () => void) => void;
}

export interface IColumn { }
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
  commands: ICommand[];
  errorMessage: string;
  viewType: ViewType;
  selectedItems: IItem[];
}
