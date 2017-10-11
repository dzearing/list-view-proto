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

  public getDataSource(key: string): IDataSource {
    const prefix: string = key.split(':')[0];
    const dataSource = this._dataSources[prefix];
    return dataSource || this._defaultDataSource;
  }

  public normalizeKey(key: string): string {
    // setKeys contain information consumable by the DSM
    // this will convert the key to a form that the datasources can consume
    const normalizedKey: string = key.indexOf(':') === -1 ? key : key.split(':')[1];
    return normalizedKey;
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
        /* no-op */
      }
    };

    if (!this._subscriptionsBySet[setKey]) {
      this._subscriptionsBySet[setKey] = [];
    }
    this._subscriptionsBySet[setKey].push(subscription);

    this.getDataSource(setKey).openSet(this.normalizeKey(setKey), actions);

    return subscription;
  }

  public invalidateSet(setKey: string): void {
    let subscriptions = this._subscriptionsBySet[setKey];
    if (subscriptions && subscriptions.length > 0) {
      let refreshSet = this.getDataSource(setKey).refreshSet;
      if (refreshSet) {
        refreshSet(
          this.normalizeKey(setKey),
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
          () => {
            /* no-op */
          }
        );
      }
    }
  }

}

const dataSourceManager = new DataSourceManager();

export default dataSourceManager;