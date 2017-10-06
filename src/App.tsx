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

        <div className='App-column'>
          <FilesScope>
            <FilesCommandBar />
            <FilesBreadcrumb />
            <FilesView setKey='' />
            <DevTools />
          </FilesScope>
        </div>

        <div className='App-column'>
          <FilesScope>
            <FilesCommandBar />
            <FilesBreadcrumb />
            <FilesView setKey='politics' />
            <DevTools />
          </FilesScope>

        </div>

      </div>
    );
  }
}

export default App;
