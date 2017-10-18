import { GraphService, IDriveResponse, getData } from './graph/getData';
import { IBreadcrumb, IColumn, IDataSource, IItem, IOpenSetResponse, ISetActions } from '../interfaces';
import { createLinkCrumb, createTextCrumb } from '../utilities/breadcrumbs';
import { dateFacet, textFacet } from '../utilities/facets';
import { facetColumn, nameColumn } from '../utilities/columns';

import { formatFileSize } from '../utilities/formatFileSize';

interface INormalizedGraphResponse {
  items: IItem[];
}

const ROOT_KEY = 'root';

const _breadcrumbCache: {
  [key: string]: {
    text: string;
    key: string;
    parentKey?: string;
  }
} = {
    [ROOT_KEY]: {
      text: 'Files',
      key: 'root',
      parentKey: undefined
    }
  };

function openSet(setKey: string, actions: ISetActions): IOpenSetResponse {
  // 1. parse setKey, extract details.
  const setId = setKey || ROOT_KEY;

  let hasCanceled = false;
  let pendingRequest = false;
  let items: IItem[] = [];
  let breadcrumbs: IBreadcrumb[] = _getBreadcrumbs(setId, actions);
  let columns: IColumn[] = _getColumns(setKey);

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
              columns,
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
    columns,
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
    items: graphResponse.value.map(driveItem => {
      _breadcrumbCache[driveItem.id] = {
        text: driveItem.name,
        key: driveItem.id,
        parentKey: driveItem.parentReference.path === '/drive/root:' ? ROOT_KEY : driveItem.parentReference.id
      };

      return {
        key: driveItem.id,
        displayName: driveItem.name,
        facets: {
          dateModified: dateFacet(driveItem.lastModifiedDateTime),
          size: textFacet(formatFileSize(Number(driveItem.size)))
        }
      };
    })
  };
}

function _getBreadcrumbs(id: string, actions: ISetActions): IBreadcrumb[] {
  const breadcrumbs: IBreadcrumb[] = [];
  let currentCrumb = _breadcrumbCache[id];

  if (!currentCrumb) {
    return [createTextCrumb('Files')];
  } else {
    breadcrumbs.push(createTextCrumb(currentCrumb.text));
    currentCrumb = _breadcrumbCache[currentCrumb.parentKey!];

    while (currentCrumb) {
      breadcrumbs.splice(0, 0, createLinkCrumb(currentCrumb.text, currentCrumb.key, actions));
      currentCrumb = _breadcrumbCache[currentCrumb.parentKey!];
    }
  }

  return breadcrumbs;
}

function _getColumns(setKey: string): IColumn[] {
  return [
    nameColumn,
    facetColumn('dateModified', 'Date modified'),
    facetColumn('size', 'Size')
  ];
}

export const OneDriveDataSource: IDataSource = {
  openSet
};
