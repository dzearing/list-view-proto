import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import { Breadcrumb } from 'office-ui-fabric-react';

export interface IFilesBreadcrumbProps {
  items: any[]
}

export interface IFilesBreadcrumbState { }

class FilesBreadcrumbBase extends React.Component<IFilesBreadcrumbProps, IFilesBreadcrumbState> {
  public render(): JSX.Element {
    const { items } = this.props;

    return (
      <Breadcrumb
        items={ items }
      />
    );
  }
}

export const FilesBreadcrumb = connect(
  state => ({
    items: state.breadcrumbs
  }),
  dispatch => ({
    actions: bindActionCreators(actionCreators as any, dispatch)
  })
  // tslint:disable-next-line:no-any
)(FilesBreadcrumbBase as any);
