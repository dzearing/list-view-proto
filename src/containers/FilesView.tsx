// tslint:disable:no-any

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
  setKey?: string;
}

export interface IFilesViewBaseProps extends IFilesViewProps {
  items: IItem[];
  columns: IColumn[];
  openSet: typeof openSet;
}

export class FilesViewBase extends React.Component<IFilesViewBaseProps, {}> {
  public render(): JSX.Element {
    const { columns, items } = this.props;

    return (
      <DetailsList
        items={ items }
        columns={ columns }
        onItemInvoked={ item => this.props.openSet(item.key) }
      />
    );
  }

  public componentDidMount(): void {
    this.props.openSet(this.props.setKey!);
  }
}

export const FilesView: React.ComponentClass<IFilesViewProps> = connect(
  store => ({
    columns: store.columns,
    items: store.items
  }),
  dispatch => ({
    ...bindActionCreators(
      {
        openSet
      },
      dispatch
    )
  })
)(FilesViewBase as any) as any;