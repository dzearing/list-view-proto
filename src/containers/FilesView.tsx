import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import {
  DetailsList
} from 'office-ui-fabric-react/lib/DetailsList';

export interface IFilesViewProps {
  items: any[];
  getItems: () => void;
}

export interface IFilesViewState { }

export class FilesViewBase extends React.Component<IFilesViewProps, IFilesViewState> {
  public render(): JSX.Element {
    const { items } = this.props;

    return (
      <DetailsList
            ref='list'
            items={ items }
      />
    );
  }

  public componentDidMount(): void {
    this.props.getItems();
  }
}

export const FilesView = connect(
  state => ({
    items: state.items
  }),
  dispatch => ({
    ...bindActionCreators(actionCreators as any, dispatch)
  })
)(FilesViewBase as any);