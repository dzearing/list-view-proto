import * as React from 'react';
import { Link } from 'office-ui-fabric-react';
import { IFacet, FacetType } from '../interfaces';

export interface IFacetCellProps {
  facet: IFacet;
}

export const FacetCell = (props: IFacetCellProps): JSX.Element => {
  let { facet } = props;

  switch (facet.type) {
    case FacetType.text:
      return (
        <span>{ facet.text }</span>
      );

    case FacetType.link:
      return (
        <Link href={ facet.href }>{ facet.text }</Link>
      );

    default:
      return <div />;
  }
};
