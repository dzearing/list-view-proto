import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openSet } from '../actions';

import {
  DetailsList,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import { IItem } from '../interfaces';

export interface IFilesViewProps {
  items: IItem[];
  columns: IColumn[];
  openSet: () => void;
}

export interface IFilesViewState { }

export class FilesViewBase extends React.Component<IFilesViewProps, IFilesViewState> {
  public render(): JSX.Element {
    const { columns, items } = this.props;

    return (
      <DetailsList
        items={ items }
        columns={ columns }
      />
    );
  }

  public componentDidMount(): void {
    this.props.openSet();
  }
}

export const FilesView = connect(
  state => ({
    columns: state.columns,
    items: state.items
  }),
  dispatch => ({
    ...bindActionCreators(
      {
        openSet
      },
      dispatch
    )
  })
)(FilesViewBase as any);