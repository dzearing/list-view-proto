import * as React from 'react';
import { Link } from 'office-ui-fabric-react';
import { connect } from 'react-redux';
import { IItem } from '../interfaces';
import { openSet } from '../actions';

export interface INameCellProps {
  item: IItem;
  onClick?: () => void;
}

export const NameCellBase = (props: INameCellProps) => (
  <Link onClick={ props.onClick }>{ props.item.displayName }</Link>
);

export const NameCell = connect(
  store => ({}),
  (dispatch, props: INameCellProps) => ({
    onClick: () => dispatch(openSet(props.item.key))
  }))(NameCellBase as any);
