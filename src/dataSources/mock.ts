import { IItem, ISetActions, ICreateNewActionContext, IRenameActionContext } from '../interfaces';

export const MockDataSource = {
  openSet: (setKey: string, actions: ISetActions) => {
    function getItems(): void {
      setTimeout(
        () => {
          let items = itemStore.getItems(setKey);
          actions.updateItems(setKey, items, [], []);
          return items;
        },
        500
      );
    }

    getItems();
    // Return callbacks for getting new items and closing the set.
    return {
      getMoreItems: getItems,
      closeSet: () => { /* no-op */ }
    };
  },

  refreshSet: (
    setKey: string,
    // tslint:disable-next-line:no-any
    onComplete: (items: any[]) => any,
    onError: () => void
  ) => {
    setTimeout(
      () => {
        let items = itemStore.getItems(setKey);
        onComplete(items);
        return items;
      },
      500
    );
  },

  deferredActions: {
    'CREATE_NEW': (context: ICreateNewActionContext) => {
        setTimeout(
          () => {
            const item = itemStore.createItem(context.setKey);
            context.onComplete(item);
          },
          500
        );
    },
    'RENAME': (context: IRenameActionContext) => {
        setTimeout(
          () => {
            const item = itemStore.renameItem(context.setKey, context.itemKey, context.newName);
            context.onComplete(item);
          },
          500
        );
    }
  }
};

class ItemStore {
  private _itemsDictionary: { [key: string]: IItem[] };

  constructor() {
    this._itemsDictionary = {};
  }

  getItems(key: string): IItem[] {
    if (!this._itemsDictionary[key]) {
      this._itemsDictionary[key] = [getItem(), getItem(), getItem()];
    }
    return this._itemsDictionary[key];
  }

  createItem(key: string): IItem {
    let items = this._itemsDictionary[key];
    const newItem = getItem();

    this._itemsDictionary[key] = [newItem].concat(items);
    return newItem;
  }

  renameItem(key: string, itemKey: string, newName: string): IItem {
    let items = this._itemsDictionary[key];
    let newItems = [...items];
    let returnItem;

    newItems.forEach((item) => {
      if (item.key === itemKey) {
        item.displayName = newName;
        returnItem = item;
      }
    });
    this._itemsDictionary[key] = newItems;
    return returnItem;
  }
}

let itemStore = new ItemStore();

function getItem() {
  let item = Math.floor(Math.random() * 100).toString();

  return {
    key: item,
    displayName: 'item-' + item
  };
}