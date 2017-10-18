import {
  openSet,
  reportError,
  reportStatus,
  setLoading,
  updateItems
} from '../actions';

import { IContextualMenuItem } from 'office-ui-fabric-react';

// export const enum ItemType {
//   folder = 'folder',
//   sharedFolder = 'sharedFolder',
//   file = 'file'
// }

export const enum FacetType {
  text = 'text',
  image = 'image',
  link = 'link',
  date = 'date',
  unsupported = 'none'
}

export interface IImageFacet {
  type: FacetType.image;
  src: string;
}

export interface ITextFacet {
  type: FacetType.text;
  text: string;
}

export interface ILinkFacet {
  type: FacetType.link;
  text: string;
  href: string;
}

export interface IDateFacet {
  type: FacetType.date;
  date: Date;
}

export type IFacet = ITextFacet | ILinkFacet | IDateFacet;

export type IFacetDictionary = { [fieldName: string]: IFacet };

export interface IItem {
  key: string;
  displayName: string;
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
  openSet: typeof openSet;
  reportError: typeof reportError;
  reportStatus: typeof reportStatus;
  setLoading: typeof setLoading;
  updateItems: typeof updateItems;
}

export interface IOpenSetResponse {
  getMoreItems: () => void;
  closeSet: () => void;
}

export interface IDataSource {
  openSet: (setKey: string, actions: ISetActions) => IOpenSetResponse;
  // tslint:disable-next-line:no-any
  createItem?: (setKey: string, onComplete: (item: IItem) => any, onError: () => void) => void;
  renameItem?: (
    setKey: string,
    itemKey: string,
    newName: string,
    // tslint:disable-next-line:no-any
    onComplete: (item: IItem) => any,
    onError: () => void
  ) => void;
  // tslint:disable-next-line:no-any
  refreshSet?: (setKey: string, onComplete: (items: IItem[]) => any, onError: () => void) => void;
}

export interface IColumn { }
export interface IButton { }

export interface IBreadcrumb {
  key: string;
  text: string;
  href?: string;
  onClick?: () => void;
}

export const enum ViewType {
  compactList = 1,
  fullList = 2,
  grid = 3
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
