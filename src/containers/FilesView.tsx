// tslint:disable:no-any

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openSet, setSelectedItems } from '../actions';
import {
  DetailsList,
  IColumn,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import { IItem } from '../interfaces';

export interface IFilesViewProps {
  setKey: string;
  items: IItem[];
}

export interface IFilesViewBaseProps extends IFilesViewProps {
  columns: IColumn[];
  openSet: typeof openSet;
  isLoading: boolean;
  setSelectedItems: (selectedItems: IItem[]) => void;
}

export class FilesViewBase extends React.Component<IFilesViewBaseProps, {}> {
  private _selection: Selection;

  constructor(props) {
    super(props);

    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._selection = new Selection({
      onSelectionChanged: this._onSelectionChange
    })
  }

  public render(): JSX.Element {
    const { isLoading, items, columns } = this.props;

    const listColumns = (!columns || columns.length === 0) ? undefined : columns;

    return isLoading ? (
      <div>Loading...</div>
    ) : (
      <DetailsList
        items={ items }
        columns={ listColumns }
        onItemInvoked={ item => this.props.openSet(item.key) }
        selection={ this._selection }
      />
    );
  }

  public componentDidMount(): void {
    this.props.openSet(this.props.setKey!);
  }

  private _onSelectionChange() {
    this.props.setSelectedItems(this._selection.getSelection() as IItem[]);
  }
}

export const FilesView = connect(
  store => ({
    setKey: store.setKey,
    items: store.items,
    columns: store.columns,
    isLoading: store.isLoading
  }),
  dispatch => ({
    ...bindActionCreators(
      {
        openSet,
        setSelectedItems
      },
      dispatch
    )
  })
)(FilesViewBase as any) as any;
