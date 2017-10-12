import { updateItems, reportStatus, reportError } from '../actions';
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
  dataSourceActionKey?: string;
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
  refreshSet?: (setKey: string, onComplete: (items: IItem[]) => any, onError: () => void) => void;
  deferredActions?: IActionsDictionary;
}

export interface IRenameActionContext {
    setKey: string;
    itemKey: string;
    newName: string;
    onComplete: (item: IItem) => any;
    onError: () => void;
}
export type IRenameAction = (context: IRenameActionContext) => void;

export interface ICreateNewActionContext {
  setKey: string,
  onComplete: (item: IItem) => any;
  onError: () => void;
}
export type ICreateNewAction = (context: ICreateNewActionContext) => void;

export type IDataSourceAction = IRenameAction | ICreateNewAction;
export type IActionsDictionary = { [actionType: string]: IDataSourceAction };

export interface IColumn { }
export interface IButton { }

export interface IBreadcrumb {
  key: string;
  text: string;
  href?: string;
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
