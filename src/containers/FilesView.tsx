import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';

export interface IFilesViewProps {
  openItemSet: () => void;
}

export interface IFilesViewState { }

export class FilesViewBase extends React.Component<
  IFilesViewProps,
  IFilesViewState
  > {
  public render(): JSX.Element {
    return <div>I am the files view.</div>;
  }

  public componentDidMount(): void {
    this.props.openItemSet();
  }
}

export const FilesView = connect(
  state => ({
    text: state
  }),
  dispatch => ({
    ...bindActionCreators(actionCreators as any, dispatch)
  })
)(FilesViewBase as any);