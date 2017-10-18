import dataSourceManager from '../../dataSources/DataSourceManager';
import { getDataSourceAction } from './helper';
import { ICommand, ICommandContext, ICreateNewAction } from '../../interfaces';

export const execute = (command: ICommand, context: ICommandContext) => {
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
    } else {
        alert("the datasource does not support this action");
    }
};