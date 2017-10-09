
import { IDataSource, ISetActions, IOpenSetResponse, IItem, IBreadcrumb } from '../interfaces';
import { GraphService, IDriveResponse, getData } from './graph/getData';
import { defaultColumns } from '../utilities/columns';
import { createTextCrumb, createLinkCrumb } from '../utilities/breadcrumbs';

interface INormalizedGraphResponse {
  items: IItem[];
}

const ROOT_KEY = 'root';

function openSet(setKey: string, actions: ISetActions): IOpenSetResponse {
  // 1. parse setKey, extract details.
  const setId = setKey || ROOT_KEY;

  let hasCanceled = false;
  let pendingRequest = false;
  let items: IItem[] = [];
  let breadcrumbs: IBreadcrumb[] = _getBreadcrumbs(setKey);

  // let nextPageToken: string | undefined;

  function _getMoreItems(): void {
    if (!pendingRequest) {
      pendingRequest = true;

      // 2. fetch items.
      getData<IDriveResponse>(GraphService.files, `items/${setId}/children`)
        .then(graphResponse => {
          pendingRequest = false;

          console.log(graphResponse);
          let response = _normalize(graphResponse);

          if (!hasCanceled) {
            // nextPageToken = response.pageToken;

            // 3. on success, report success.
            actions.updateItems(
              setKey,
              items.concat(response.items),
              defaultColumns,
              breadcrumbs
            );
          }
        })
        .catch((error: Error) => {
          pendingRequest = false;
          if (!hasCanceled) {
            actions.reportError(error);
          }
        });
    }
  }

  // Clear state
  actions.updateItems(
    setKey,
    [],
    defaultColumns,
    breadcrumbs
  );

  // Start the fetching.
  _getMoreItems();

  // Return callbacks for getting new items and closing the set.
  return {
    getMoreItems: _getMoreItems,
    closeSet: () => {
      hasCanceled = true;
    }
  };
}

function _normalize(graphResponse: IDriveResponse): INormalizedGraphResponse {
  return {
    items: graphResponse.value.map(driveItem => ({
      key: driveItem.id,
      displayName: driveItem.name,
      itemType: 'folder',
      facets: {
        dateModified: {
          type: 'date',
          date: new Date(driveItem.lastModifiedDateTime)
        },
        size: {
          type: 'text',
          text: driveItem.size
        }
      }
    }))
  };
}

function _getBreadcrumbs(setKey: string): IBreadcrumb[] {
  const breadcrumbs: IBreadcrumb[] = [];
  const rootSetKey = '';
  const isAtRoot = true;

  if (isAtRoot) {
    breadcrumbs.push(
      isAtRoot
        ? createTextCrumb('Files')
        : createLinkCrumb('Files', rootSetKey)
    );
  }

  return breadcrumbs;
}

export const OneDriveDataSource: IDataSource = {
  openSet
};
