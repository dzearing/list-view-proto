import * as React from 'react';

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

  render() {
    return (
      <div className="App">

        <FilesScope>
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
