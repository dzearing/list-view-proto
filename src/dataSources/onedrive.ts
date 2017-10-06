import { IItem } from '../configureStore';

export const OneDriveDataSource = {
  getItems: (
    setKey: string,
    onComplete: (items: any[]) => any,
    onError: () => void
  ) => {
    // tslint:disable-next-line:no-console
    console.log('I am making an xhr call.');

    setTimeout(
      () => {
        // tslint:disable-next-line:no-console
        console.log('I am done.');

        let items = itemStore.getItems(setKey);
        onComplete(items);
        return items;
      },
      500
    );
  },

  createItem: (
    setKey: string,
    onComplete: (item: any) => any,
    onError: () => void
  ) => {
    setTimeout(
      () => {
        const item = itemStore.createItem(setKey);
        onComplete(item);
      },
      500
    );
  },

  renameItem: (
    setKey: string,
    itemKey: string,
    newName: string,
    onComplete: (item: any) => any,
    onError: () => void
  ) => {
    setTimeout(
      () => {
        const item = itemStore.renameItem(setKey, itemKey, newName);
        onComplete(item);
      },
      500
    );
  }

};

class ItemStore {
  private _itemsDictionary: { [key: string] : IItem[] };

  constructor() {
    this._itemsDictionary = {};
  }

  getItems(key: string): IItem[] {
    if (!this._itemsDictionary[key]) {
      this._itemsDictionary[key] = [ getItem(), getItem(), getItem() ];
    }
    return this._itemsDictionary[key];
  }

  createItem(key: string): IItem {
    let items = this._itemsDictionary[key];
    const newItem = getItem();
    this._itemsDictionary[key] = [ newItem ].concat(items);
    return newItem;
  }

  renameItem(key: string, itemKey: string, newName: string): void {
    let items = this._itemsDictionary[key];
    let newItems = [ ...items];
    newItems.forEach((item) => {
      if (item.key === itemKey) {
        item.text = newName;
      }
    });
    this._itemsDictionary[key] = newItems;
  }
}

let itemStore = new ItemStore();

function getItem() {
    let item = Math.floor(Math.random()*10).toString();
    return {
        key: item,
        text: 'item-' + item
    };
}