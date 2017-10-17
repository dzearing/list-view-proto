import * as React from 'react';
import { CommandBar, IContextualMenuItem } from 'office-ui-fabric-react';
import { connect } from 'react-redux';
import { ICommand, IItem, ICommandContext, ICommandExecutor} from '../interfaces';

export interface IFilesCommandBarProps {
  items: ICommand[];
  setKey: string;
  selectedItems: IItem[];
}

export class FilesCommandBarBase extends React.Component<IFilesCommandBarProps, {}> {
  render() {
    const context = this._getCommandContext();
    const menuItems = this.props.items.filter((command: ICommand) =>
      this._isCommandAvailable(command, context)).map((command: ICommand) => {
        return {
          ...command,
          onClick: () => {
              onCommandClick(command, context);
          }
        } as IContextualMenuItem;
      });
    return (
      <CommandBar items={ menuItems } />
    );
  }

  private _isCommandAvailable(command: ICommand, context: ICommandContext): boolean {
    return command.isAvailable ? command.isAvailable(context) : true;
  }

  private _getCommandContext(): ICommandContext {
    const { setKey, selectedItems } = this.props;
    return {
      setKey: setKey,
      selectedItems: selectedItems
    };
  }
}

async function onCommandClick(command: ICommand, context: ICommandContext): Promise<ICommandExecutor> {
  const executorPromise = await command.loadExecutor;
  return executorPromise().then((executor: ICommandExecutor) => {
    executor.execute(command, context);
    return executor;
  });
}

export const FilesCommandBar = connect(
  state => ({
    items: state.commands,
    setKey: state.setKey,
    selectedItems: state.selectedItems
  }),
  dispatch => ({ })
  // tslint:disable-next-line:no-any
)(FilesCommandBarBase as any);
