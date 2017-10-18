import { getAuthToken } from './getAuthToken';

const BASE_URL = 'https://graph.microsoft.com/beta';

export const enum GraphService {
  profile = 'me',
  files = 'me/drive',
  mail = 'me/messages'
}

export interface IGraphResponse<T> {
  '@odata.context': string;
  value: T[];
}

export interface IDriveItem {
  cTag: string;
  createdBy: {
    createdDateTime: string;
    eTag: string;
  };
  fileSystemInfo: {
    createdDateTime: string;
    lastModifiedDateTime: string;
  };
  folder?: {
    childCount: number;
    view: {
      viewType: 'thumbnails';
      sortBy: string;
      sortOrder: 'ascending' | 'descending';
    }
  };
  id: string;
  lastModifiedBy: {};
  lastModifiedDateTime: string;
  name: string;
  parentReference: {
    driveId: string;
    id: string;
    path: string;
  };
  size: string;
  specialFolder?: {
    name: string;
  };
  webUrl: string;
}

export interface IDriveResponse extends IGraphResponse<IDriveItem> { }

export function getData<T>(
  service: string,
  path: string,
  orderBy?: string,
  orderAscending?: boolean
): Promise<T> {
  return new Promise((resolve, reject) => {
    getAuthToken().then(async token => {
      const headers = new Headers();

      headers.set('Authorization', `Bearer ${token}`);

      const options: RequestInit = {
        method: 'GET',
        headers,
        mode: 'cors',
        cache: 'default'
      };
      const orderParams = orderBy !== undefined ? `orderby=${orderBy} ${orderAscending ? 'asc' : 'desc'}` : '';
      const url = `${BASE_URL}/${service}/${path}?${orderParams}`;

      return fetch(url, options)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(error => reject(error));
    });
  });
}
