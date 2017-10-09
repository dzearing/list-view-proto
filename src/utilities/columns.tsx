// export function getNameColumn(): IColumn {}
import * as React from 'react';
import { NameCell } from '../components/NameCell';

export const nameColumn = {
  key: 'displayName',
  name: 'Name',
  fieldName: 'displayName',
  minWidth: 200,
  maxWidth: 400,
  onRender: item => <NameCell item={ item } />
};

export const defaultColumns = [
  nameColumn
];
