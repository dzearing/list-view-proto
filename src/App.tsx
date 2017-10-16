import * as React from 'react';
import dataSourceManager from './dataSources/DataSourceManager';
import { MockDataSource } from './dataSources/mock';
import { RedditDataSource } from './dataSources/reddit';
import { OneDriveDataSource } from './dataSources/onedrive';
// import topCommands from './commands/topCommands';
import './App.css';
import {
  FilesBreadcrumb,
  FilesCommandBar,
  FilesScope,
  FilesView
} from './containers';
import './App.css';

import { DevTools } from './containers/DevTools';

class App extends React.Component {
  constructor() {
    super();

    dataSourceManager.addDataSource('mock', MockDataSource);
    dataSourceManager.addDataSource('reddit', RedditDataSource);
    dataSourceManager.addDataSource('od', OneDriveDataSource); // default
  }

  render() {
    let config = {
      // topCommands: topCommands,
      setKey: 'mock:root'
    };

    return (
      <div className='App'>
        <div className="AppTitle">CUSTOM</div>
        <FilesScope config={ config } >
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
