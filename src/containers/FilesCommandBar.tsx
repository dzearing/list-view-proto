import * as React from 'react';
import { CommandBar, ICommandBarProps } from 'office-ui-fabric-react';
import { connect } from 'react-redux';

export class FilesCommandBarBase extends React.Component<ICommandBarProps, {}> {
  render() {
    return (
      <CommandBar items={ this.props.items } />
    );
  }
}

export const FilesCommandBar = connect(
  state => ({
    items: state.commands
  })
  // tslint:disable-next-line:no-any
)(FilesCommandBarBase as any);
