import * as React from 'react';
import { CommandBar, IContextualMenuItem } from 'office-ui-fabric-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { executeDeferredCommand } from '../actions/actions';
import { ICommand, IItem, ICommandContext } from '../interfaces';

export interface IFilesCommandBarProps {
  items: ICommand[];
  setKey: string;
  executeDeferredCommand: (command: ICommand, context: ICommandContext) => void;
  selectedItems: IItem[];
}

export class FilesCommandBarBase extends React.Component<IFilesCommandBarProps, {}> {
  render() {
    const { executeDeferredCommand } = this.props;

    const context = this._getCommandContext();
    const menuItems = this.props.items.filter((command: ICommand) =>
      this._isCommandAvailable(command, context)).map((command: ICommand) => {
        return {
          ...command,
          onClick: () => {
              executeDeferredCommand(command, context);
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

export const FilesCommandBar = connect(
  state => ({
    items: state.commands,
    setKey: state.setKey,
    selectedItems: state.selectedItems
  }),
  dispatch => ({
    ...bindActionCreators({
      executeDeferredCommand
    }, dispatch)
  })
  // tslint:disable-next-line:no-any
)(FilesCommandBarBase as any);
