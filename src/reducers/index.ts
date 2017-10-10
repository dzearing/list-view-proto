import { IFilesStore, ViewType } from '../interfaces';
import { TypeKeys, ActionTypes } from '../actions';
import topCommands from '../defaults/topCommands';

export const DEFAULT_STATE = {
  setKey: '',
  viewType: ViewType.fullList,
  isLoading: false,
  breadcrumbs: [],
  columns: [],
  items: [],
  selectedItems: [],
  commands: topCommands,
  errorMessage: ''
};

export const rootReducer = (state: IFilesStore = DEFAULT_STATE, action: ActionTypes): IFilesStore => {
  switch (action.type) {

    case TypeKeys.UPDATE_ITEMS:
      {
        const { breadcrumbs, columns, items } = action;

        return {
          ...state,
          isLoading: false,
          breadcrumbs,
          columns,
          items
        };
      }

    case TypeKeys.SET_LOADING:
      {
        return {
          ...state,
          isLoading: true
        };
      }

    case TypeKeys.SET_SELECTION:
      {
        const items = action.data || [];
        return {
          ...state,
          selectedItems: items
        };
      }

    default:
      return state;
  }
};