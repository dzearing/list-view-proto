import { IItem, IFilesStore } from '../configureStore';
import { Dispatch } from 'redux';

interface IDataSetSubscription {
  setKey: string;
  dispatch: Dispatch<IFilesStore>;
  dispose: () => void;
}

export interface IDataSource {
  getItems: (setKey: string, onComplete: (items: IItem[]) => any, onError: () => void) => void;
  createItem: (setKey: string, onComplete: (item: IItem) => any, onError: () => void) => void;
  renameItem: (setKey: string, itemKey: string, newName: string, onComplete: (item: IItem) => any, onError: () => void) => void;
}

class DataSourceManager {
  private _dataSources: { [suffix: string]: IDataSource };
  private _defaultDataSource: IDataSource;
  private _subscriptionsBySet: { [setKey: string]: IDataSetSubscription[] };

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

  public getDataSource(): IDataSource {
    // make this smart to parse the key and pick the right datasource
    return this._defaultDataSource;
  }

  public open(
    setKey: string,
    dispatch: Dispatch<IFilesStore>
  ): IDataSetSubscription {
    const subscription: IDataSetSubscription = {
      setKey: setKey,
      dispatch: dispatch,
      dispose: () => {
        /* */
      }
    };
    if (!this._subscriptionsBySet[setKey]) {
      this._subscriptionsBySet[setKey] = [];
    }
    this._subscriptionsBySet[setKey].push(subscription);

    this._defaultDataSource.getItems(
      setKey,
      (items) => dispatch({
        type: 'UPDATE_ITEMS',
        data: {
          setKey,
          items
        }
      }),
      () => {}
    );

    return subscription;
  }

  public invalidateSet(setKey: string): void {
    let subscriptions = this._subscriptionsBySet[setKey];
    if (subscriptions && subscriptions.length > 0) {
      this._defaultDataSource.getItems(
        setKey,
        (items) => {
          subscriptions.forEach((sub: IDataSetSubscription) => {
            sub.dispatch({
              type: 'UPDATE_ITEMS',
              data: {
                setKey,
                items
              }
            })
          });
        },
        () => {}
      );
    }
  }

}

const dataSourceManager = new DataSourceManager();
export default dataSourceManager;