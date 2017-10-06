import { IItem, IDataSource, ISetActions, IOpenSetResponse } from '../interfaces';

const textFacet = (text: string) => ({ type: 'text', text });
const linkFacet = (text: string, href: string) => ({ type: 'link', text, href });
const imageFacet = (url: string) => ({ type: 'image', url });

interface IRedditResponse {
  children: {
    data: {
      author: string;
      id: string;
      num_comments: string;
      score: string;
      subreddit: string;
      thumbnail: string;
      title: string;
      url: string;
    }
  }[];
  after: string;
}

interface INormalizedRedditResponse {
  items: IItem[];
  pageToken: string;
}

function openSet(setKey: string = 'bostonterriers', actions: ISetActions): IOpenSetResponse {
  let hasCanceled = false;
  let pendingRequest = false;
  let items: IItem[] = [];
  let nextPageToken: string | undefined;

  function _getMoreItems(): void {
    if (!pendingRequest) {
      pendingRequest = true;

      // 1. parse setKey, extract details.
      const subreddit = setKey;

      // 2. fetch items.
      _getItems(subreddit, nextPageToken)

        // 3. on success, report success.
        .then(response => {
          pendingRequest = false;
          if (!hasCanceled) {
            nextPageToken = response.pageToken;
            actions.updateItems(setKey, items.concat(response.items));
          }
        })

        // 4. on failure, report failure.
        .catch((error: Error) => {
          pendingRequest = false;
          if (!hasCanceled) {
            actions.reportError(error);
          }
        });
    }
  }

  // Start the fetching.
  _getMoreItems();

  // return callbacks for getting new items and closing the set.
  return {
    getMoreItems: _getMoreItems,
    closeSet: () => {
      hasCanceled = true;
    }
  };
}

function _getItems(subreddit: string, nextPageToken?: string): Promise<INormalizedRedditResponse> {
  const url = `https://www.reddit.com/r/` +
    `${subreddit}.json` +
    `${nextPageToken ? '?after=' + nextPageToken : ''}`;

  return fetch(url).then(
    response => response.json()).then(json => _normalize(json.data));
}

function _normalize(response: IRedditResponse): INormalizedRedditResponse {
  return {
    items: response.children.map(child => {
      const data = child.data;

      return {
        key: data.id,
        displayName: data.title,
        itemType: 'file',
        facets: {
          subreddit: textFacet(data.subreddit),
          title: textFacet(data.title),
          author: textFacet(data.author),
          url: linkFacet(data.title, data.url),
          score: textFacet(data.score),
          thumb: imageFacet(data.thumbnail),
          comments: textFacet(data.num_comments)
        }
      };
    }),
    pageToken: response.after
  };
}

export const RedditDataSource: IDataSource = {
  openSet
};
