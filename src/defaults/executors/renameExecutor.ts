import dataSourceManager from '../../dataSources/DataSourceManager';
import { getDataSourceAction } from './helper';
import { ICommand, ICommandContext, IRenameAction } from '../../interfaces';

export const execute = (command: ICommand, context: ICommandContext) => {
    let renameItem = getDataSourceAction(context.setKey, command.dataSourceActionKey) as IRenameAction;
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
};