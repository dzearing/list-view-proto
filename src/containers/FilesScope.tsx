import * as React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { IFilesStore, IFilesStoreConfiguration } from '../interfaces';
import { configureStore } from '../configureStore';
import { Fabric } from 'office-ui-fabric-react';

export interface IFilesScopeProps {
  config?: IFilesStoreConfiguration;
}

export class FilesScope extends React.Component<IFilesScopeProps, {}> {
  private _store: Store<IFilesStore>;

  constructor(props: IFilesScopeProps) {
    super(props);
    this._store = configureStore(this.props.config);
  }

  render() {
    return (
      <Provider store={ this._store }>
        <Fabric>
          { this.props.children }
        </Fabric>
      </Provider>
    );
  }
}
