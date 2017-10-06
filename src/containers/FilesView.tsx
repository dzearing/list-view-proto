import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import {
  DetailsList,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import { IItem } from '../configureStore';

export interface IFilesViewProps {
  setKey: string;
  items: IItem[];
  isLoading: boolean;
  getItems: (setKey: string) => void;
  setSelectedItems: (selectedItems: IItem[]) => void;
}

export interface IFilesViewState { }

export class FilesViewBase extends React.Component<IFilesViewProps, IFilesViewState> {
  private _selection: Selection;

  constructor(props) {
    super(props);

    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._selection = new Selection({
      onSelectionChanged: this._onSelectionChange
    })
  }

  public render(): JSX.Element {
    const { isLoading, items } = this.props;
    return isLoading ? (
      <div>Loading...</div>
    ) : (
      <DetailsList
            ref='list'
            selection={ this._selection }
            items={ items }
      />
    );
  }

  public componentDidMount(): void {
    const { getItems, setKey } = this.props;
    getItems(setKey);
  }

  private _onSelectionChange() {
    this.props.setSelectedItems(this._selection.getSelection() as IItem[]);
  }
}

export const FilesView = connect(
  state => ({
    setKey: state.setKey,
    items: state.items,
    isLoading: state.isLoading
  }),
  dispatch => ({
    ...bindActionCreators(actionCreators as any, dispatch)
  })
)(FilesViewBase as any);