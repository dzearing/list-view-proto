import dataSourceManager from '../../dataSources/DataSourceManager';
import { getDataSourceAction } from './helper';
import { ICommand, ICommandContext, IRenameAction } from '../../interfaces';

export const execute = (command: ICommand, context: ICommandContext) => {
    alert('Showing dialog to accept new name');
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
    } else {
        alert("the datasource does not support this action");
    }
};