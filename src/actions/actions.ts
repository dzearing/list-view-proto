import { Dispatch, bindActionCreators } from 'redux';
import dataSourceManager from '../dataSources/DataSourceManager';
import { IFilesStore, ISetActions, ICommand, ICommandContext, ICommandExecutor } from '../interfaces';
import { setLoading, updateItems, reportStatus, reportError } from './reducerActions';

export const openSet = (setKey: string) => {
  return (dispatch: Dispatch<IFilesStore>) => {
    dispatch(setLoading(true));

    dataSourceManager.openSet(
      setKey,
      {
        ...bindActionCreators(
          {
            updateItems,
            reportStatus,
            reportError
          },
          dispatch
        ) as ISetActions
      },
      dispatch
    );
  };
};

export const executeDeferredCommand = (command: ICommand, context: ICommandContext) => {
  async function onCommandClick(command: ICommand, context: ICommandContext): Promise<ICommandExecutor> {
    const executorPromise = await command.loadExecutor;
    return executorPromise().then((executor: ICommandExecutor) => {
      executor.execute(command, context);
      return executor;
    });
  }

  return (dispatch: Dispatch<IFilesStore>) => {
    onCommandClick(command, context);
  }
}