import * as React from 'react';
import { BaseComponent, ProgressIndicator, mergeStyles } from 'office-ui-fabric-react';

const progressClassName = mergeStyles({
  selectors: {
    '& .ms-ProgressIndicator-itemName': {
      padding: 0
    },
    '& .ms-ProgressIndicator-itemProgress': {
      padding: 0
    }
  }
});

export class FilesLoadingIndicator extends BaseComponent<any, any> {
  public constructor() {
    super();

    this.state = { percentComplete: 0 };
  }

  public render() {
    return (
      <ProgressIndicator percentComplete={ this.state.percentComplete } className={ progressClassName } />
    );
  }

  public componentDidMount() {
    this._async.setInterval(
      () => {
        let newPercent = this.state.percentComplete + .1;

        if (newPercent > 1) {
          newPercent = 0;
        }
        this.setState({
          percentComplete: newPercent
        });
      },
      500
    );
  }

}