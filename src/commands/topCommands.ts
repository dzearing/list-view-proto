import { ICommand, ICommandContext } from '../interfaces';

const topCommands: ICommand[] = [
    {
      key: 'new',
      name: 'New',
      iconProps: { iconName: 'Add' },
      isAvailable: (context: ICommandContext) => {
          return context.selectedItems.length === 0;
      },
      loadExecutor: () => import('./customNewExecutor'),
      dataSourceActionKey: 'CREATE_NEW'
    },
    {
      key: 'rename',
      name: 'Rename',
      iconProps: { iconName: 'Edit' },
      isAvailable: (context: ICommandContext) => {
          return context.selectedItems.length === 1;
      },
      loadExecutor: () => import('../defaults/executors/renameExecutor'),
      dataSourceActionKey: 'RENAME'
    }
];

export default topCommands;