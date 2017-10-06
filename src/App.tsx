import * as React from 'react';
import dataSourceManager from './dataSources/DataSourceManager';
import { OneDriveDataSource } from './dataSources/onedrive';
// import topCommands from './commands/topCommands';
import './App.css';
import {
  FilesBreadcrumb,
  FilesCommandBar,
  FilesScope,
  FilesView
} from './containers';

import { DevTools } from './containers/DevTools';

// const dataSources = [
//   OneDriveDataSource({ options }),
//   SharePointDataSource({ options }),
//   etc
// ];

// DataSourceManager.addDataSources([
//   {
//     suffix: 'od',
//     dataSource: () => new OneDriveDataSource({ ..options .. })
//   }
// );

class App extends React.Component {
  constructor() {
    super();

    dataSourceManager.addDataSource('od', OneDriveDataSource);
  }

  render() {
    /* let config = {
      topCommands: topCommands,
      setKey: 'od:root1'
    }; */

    return (
      <div className="App">
        <div className="AppTitle">DEFAULT</div>
        <FilesScope >
          <FilesCommandBar />
          <FilesBreadcrumb />
          <FilesView />
          <DevTools />
        </FilesScope>
      </div>
    );
  }
}

export default App;
