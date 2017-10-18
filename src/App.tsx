import './App.css';
import './App.css';

import * as React from 'react';

import {
  DevTools,
  FilesBreadcrumb,
  FilesCommandBar,
  FilesScope,
  FilesView
} from './containers';

import { MockDataSource } from './dataSources/mock';
import { OneDriveDataSource } from './dataSources/onedrive';
import dataSourceManager from './dataSources/DataSourceManager';

// import topCommands from './commands/topCommands';
// import { Layer, LayerHost } from 'office-ui-fabric-react';


// import { DevTools } from './containers/DevTools';

class App extends React.Component {
  constructor() {
    super();

    dataSourceManager.addDataSource('mock', MockDataSource);
    dataSourceManager.addDataSource('od', OneDriveDataSource);
  }

  render() {
    // let config = {
    //   topCommands: topCommands,
    //   setKey: 'od:root1'
    // };

    return (
      <div className='App'>

        <FilesScope>
          <div className='App-commandBar'>
            <FilesCommandBar />
          </div>
          <FilesBreadcrumb />
          <FilesView />
          <DevTools />
        </FilesScope>

      </div>
    );
  }
}

export default App;
