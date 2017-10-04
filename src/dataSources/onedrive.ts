
export const OneDriveDataSource = {
  getItems: (
    setKey: string,
    onComplete: () => void,
    onError: () => void
  ) => {
    // tslint:disable-next-line:no-console
    console.log('I am making an xhr call.');

    setTimeout(
      () => {
        // tslint:disable-next-line:no-console
        console.log('I am done.');
        onComplete();
      },
      2000
    );
  }
};
