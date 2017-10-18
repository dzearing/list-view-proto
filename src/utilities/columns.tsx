// export function getNameColumn(): IColumn {}
import * as React from 'react';

import { FacetCell } from '../components/FacetCell';
import { IColumn } from 'office-ui-fabric-react';
import { NameCell } from '../components/NameCell';

export const nameColumn: IColumn = {
  key: 'displayName',
  name: 'Name',
  fieldName: 'displayName',
  minWidth: 200,
  maxWidth: 500,
  onRender: item => <NameCell item={ item } />
};

export const facetColumn = (fieldName: string, columnName: string): IColumn => ({
  key: fieldName,
  name: columnName,
  fieldName: fieldName,
  minWidth: 180,
  maxWidth: 240,
  // isSorted: true,
  // isSortedDescending: true,
  onRender: item => <FacetCell facet={ item.facets[fieldName] } />
});

export const defaultColumns = [
  nameColumn
];
