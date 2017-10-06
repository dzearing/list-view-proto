import * as React from 'react';
import dataSourceManager from './dataSources/DataSourceManager';
import { MockDataSource } from './dataSources/mock';
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

    dataSourceManager.addDataSource('od', MockDataSource);
  }

  render() {
    /* let config = {
      topCommands: topCommands,
      setKey: 'od:root1'
    }; */

    return (
      <div className='App'>
        <div className="AppTitle">DEFAULT</div>
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
