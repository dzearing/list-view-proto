import { ISetActions, IDataSource, IFilesStore } from '../interfaces';

import { Dispatch } from 'redux';

interface IDataSetSubscription {
  setKey: string;
  actions: ISetActions;
  dispatch: Dispatch<IFilesStore>;
  dispose: () => void;
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

  public openSet(
    setKey: string,
    actions: ISetActions,
    dispatch: Dispatch<IFilesStore>
  ): IDataSetSubscription {

    const subscription: IDataSetSubscription = {
      setKey: setKey,
      actions: actions,
      dispatch: dispatch,
      dispose: () => {
      }
    };

    if (!this._subscriptionsBySet[setKey]) {
      this._subscriptionsBySet[setKey] = [];
    }
    this._subscriptionsBySet[setKey].push(subscription);

    this._defaultDataSource.openSet(setKey, actions);

    return subscription;
  }

  public invalidateSet(setKey: string): void {
    let subscriptions = this._subscriptionsBySet[setKey];
    if (subscriptions && subscriptions.length > 0) {
      let refreshSet = this._defaultDataSource.refreshSet;
      if (refreshSet) {
        refreshSet(
          setKey,
          (items) => {
            subscriptions.forEach((sub: IDataSetSubscription) => {
              sub.actions.updateItems(
                setKey,
                items,
                [], // columns
                [] // breadcrumbs
              );
            });
          },
          () => {}
        );
      }
    }
  }

}

const dataSourceManager = new DataSourceManager();

export default dataSourceManager;