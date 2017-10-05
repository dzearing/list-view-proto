
export const OneDriveDataSource = {
  getItems: (
    setKey: string,
    onComplete: (items: any[]) => any,
    onError: () => void
  ) => {
    // tslint:disable-next-line:no-console
    console.log('I am making an xhr call.');

    setTimeout(
      () => {
        // tslint:disable-next-line:no-console
        console.log('I am done.');

        let items = [
          getItem(),
          getItem(),
          getItem()
        ];
        onComplete(items);
        return items;
      },
      2000
    );
  }
};

function getItem() {
    let item = 'item-' + Math.floor(Math.random()*10);
    return {
        key: item,
        text: item
    };
}

