import { ICommand, ICommandContext } from '../interfaces';

const topCommands: ICommand[] = [
    {
      key: 'new',
      name: 'New',
      iconProps: { iconName: 'Add' },
      isAvailable: (context: ICommandContext) => {
          return context.selectedItems.length === 0;
      }
    },
    {
      key: 'upload',
      name: 'Upload',
      iconProps: { iconName: 'Upload' },
      isAvailable: (context: ICommandContext) => {
          return context.selectedItems.length === 0;
      }
    }
];

export default topCommands;