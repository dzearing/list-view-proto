interface IDataSetSubscription {
  setKey: string;
  dispose: () => void;
}

interface IDataSource { }

export class DataSourceManager {
  private _dataSources: { [suffix: string]: IDataSource };
  private _defaultDataSource: IDataSource;
  private _subscriptionsBySet: { [setKey: string]: IDataSetSubscription };

  private _items = {};
  private _sets = {};
  private _itemToSet = {};

  constructor() {
    this._dataSources = {};
    this._subscriptionsBySet = {};
    this._items = {};
    this._sets = {};
    this._itemToSet = {};
  }

  public addDataSource(
    prefix: string,
    dataSource: IDataSource
  ): void {
    this._dataSources[prefix] = dataSource;
    this._defaultDataSource = dataSource;
  }

  public open(
    setKey: string,
    onItemsAvailable: () => void
  ): IDataSetSubscription {
    const subscription: IDataSetSubscription = {
      setKey,
      dispose: () => {
        /* */
      }
    };

    return subscription;
  }

}



/**

function normalizeItem() {

}

const item = {
  id: 'a',
  caps: [0, 1, 3],
  displayName: '',
  type: '',
  facets: {
    displayName: {
      type: 'name',
      text: 'File',
      setKey: '',
    },
    link: {
      type: 'url',
      text: 'asdf',
      href: 'asdf'
    },
    usage: {
      type: 'chart',
      data: [],
    }
  }
};


const actions = {};
const column = {};


*/