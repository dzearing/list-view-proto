import { OneDriveDataSource } from './onedrive';
import { RedditDataSource } from './reddit';

import { ISetActions, IDataSource } from '../interfaces';

interface IDataSetSubscription {
  setKey: string;
  actions: ISetActions;
}

class DataSourceManager {
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

  public getDataSource(): IDataSource {
    // make this smart to parse the key and pick the right datasource
    return this._defaultDataSource;
  }

  public openSet(
    setKey: string,
    actions: ISetActions
  ): IDataSetSubscription {

    const subscription: IDataSetSubscription = {
      setKey,
      actions
    };

    this._defaultDataSource.openSet(setKey, actions);

    return subscription;
  }
}

const dataSourceManager = new DataSourceManager();

dataSourceManager.addDataSource('reddit', RedditDataSource);
dataSourceManager.addDataSource('onedrive', OneDriveDataSource);

export default dataSourceManager;