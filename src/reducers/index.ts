import { IFilesStore, ViewType } from '../interfaces';
import { TypeKeys, ActionTypes } from '../actions';

const DEFAULT_STATE = {
  setKey: '',
  viewType: ViewType.List,
  isLoading: false,
  breadcrumbs: [],
  columns: [
    {
      key: 'displayName',
      name: 'Name',
      fieldName: 'displayName',
      minWidth: 200,
      maxWidth: 400
    }
  ],
  items: [],
  commands: [
    {
      key: 'new',
      name: 'New',
      iconProps: { iconName: 'Add' },
      items: [
        {
          key: 'newFolder',
          name: 'New folder'
        }
      ]
    },
    {
      key: 'upload',
      name: 'Upload',
      iconProps: { iconName: 'Upload' }
    }
  ],
  errorMessage: ''
};

export const rootReducer = (state: IFilesStore = DEFAULT_STATE, action: ActionTypes): IFilesStore => {
  switch (action.type) {

    case TypeKeys.UPDATE_ITEMS:
      {
        const { breadcrumbs, columns, items } = action;

        return {
          ...state,
          breadcrumbs,
          columns,
          items
        };
      }

    default:
      return state;
  }
};