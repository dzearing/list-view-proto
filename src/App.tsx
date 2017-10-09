import * as React from 'react';

import {
  FilesBreadcrumb,
  FilesCommandBar,
  FilesScope,
  FilesView
} from './containers';
import './App.css';

import { DevTools } from './containers/DevTools';

class App extends React.Component {

  render() {
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
