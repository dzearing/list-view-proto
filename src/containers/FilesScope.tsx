import * as React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { configureStore, IFilesStore } from '../configureStore';
import { Fabric } from 'office-ui-fabric-react';

export class FilesScope extends React.Component<{}, {}> {
  private _store: Store<IFilesStore>;

  constructor() {
    super();
    this._store = configureStore();
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
