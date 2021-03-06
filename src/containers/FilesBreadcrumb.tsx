import * as React from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Breadcrumb, IBreadcrumbItem } from 'office-ui-fabric-react';
// import { IItem } from '../interfaces';
import { createTextCrumb } from '../utilities/breadcrumbs';

export interface IFilesBreadcrumbProps {
  items: IBreadcrumbItem[];
}

export interface IFilesBreadcrumbState { }

class FilesBreadcrumbBase extends React.Component<IFilesBreadcrumbProps, IFilesBreadcrumbState> {
  public render(): JSX.Element {
    const { items } = this.props;

    let breadcrumbs = (!items || items.length === 0) ? [createTextCrumb('Files')] : items;
    return (
      <Breadcrumb
        items={ breadcrumbs }
      />
    );
  }
}

export const FilesBreadcrumb = connect(
  state => ({
    items: state.breadcrumbs
  })
  // tslint:disable-next-line:no-any
)(FilesBreadcrumbBase as any);
