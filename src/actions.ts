export const tryLoadItems = (setKey: string) => ({
  type: 'LOAD_ITEMS',
  setKey
});

export const openItemSet = (setKey: string) => ({
  type: 'OPEN_ITEM_SET'
});

export const closeItemSet = (setKey: string) => ({
  type: 'CLOSE_ITEM_SET'
});

export const itemsAvailable = () => ({
  type: 'ITEMS_AVAILABLE'
});

export const itemsError = () => ({
  type: 'ITEMS_ERROR'
});
