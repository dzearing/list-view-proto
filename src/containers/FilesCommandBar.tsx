import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';

export interface IFilesCommandBarProps {
  items: any[]
}

export class FilesCommandBarBase extends React.Component<IFilesCommandBarProps, {}> {
  render() {
    return (
      <CommandBar items={ this.props.items } />
    );
  }
}

export const FilesCommandBar = connect(
  state => ({
    items: state.commands
  }),
  dispatch => ({
    actions: bindActionCreators(actionCreators as any, dispatch)
  })
  // tslint:disable-next-line:no-any
)(FilesCommandBarBase as any);
