import dataSourceManager from '../dataSources/DataSourceManager';
import { ICommand, ICommandContext, IDataSourceAction, ICreateNewAction, IRenameAction } from '../interfaces';

export const executeCommand = (command: ICommand, context: ICommandContext) => {
  function getDataSourceAction(setKey: string, actionKey?: string): IDataSourceAction {
      if (actionKey) {
        const dataSource = dataSourceManager.getDataSource(setKey);
        if (dataSource.deferredActions) {
            return dataSource.deferredActions[actionKey];
        }
      }
      return () => {};
  }

  switch (command.key) {
    case 'new':
        let createItem = getDataSourceAction(context.setKey, command.dataSourceActionKey) as ICreateNewAction;
        if (createItem) {
          createItem({
              setKey: dataSourceManager.normalizeKey(context.setKey),
              onComplete: (item) => {
                dataSourceManager.invalidateSet(context.setKey);
              },
              onError: () => {
                /* no-op */
              }
          });
        }
      break;

    case 'rename':
        let renameItem = getDataSourceAction(context.setKey, command.dataSourceActionKey) as IRenameAction;
        if (renameItem) {
          renameItem({
            setKey: dataSourceManager.normalizeKey(context.setKey),
            itemKey: context.selectedItems[0].key,
            newName: 'new name',
            onComplete: (item) => {
              dataSourceManager.invalidateSet(context.setKey);
            },
            onError: () => {
              /* no-op */
            }
          });
        }
      break;

    default:
      break;
  }
};