import * as React from 'react';

import {
  FilesBreadcrumb,
  FilesCommandBar,
  FilesDataSource,
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

  render() {
    return (
      <div className="App">

        <FilesDataSource>

          <FilesCommandBar />
          <FilesBreadcrumb />
          <FilesView />
          <DevTools />
        </FilesDataSource>

        <FilesDataSource>

          <FilesCommandBar />
          <FilesBreadcrumb />
          <FilesView />
          <DevTools />
        </FilesDataSource>

      </div>
    );
  }
}

export default App;
