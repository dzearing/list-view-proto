import dataSourceManager from '../../dataSources/DataSourceManager';
import { IDataSourceAction } from '../../interfaces';

export function getDataSourceAction(setKey: string, actionKey?: string): IDataSourceAction {
    if (actionKey) {
        const dataSource = dataSourceManager.getDataSource(setKey);
        if (dataSource.deferredActions) {
            return dataSource.deferredActions[actionKey];
        }
    }
    return () => {};
}