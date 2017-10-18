import { ICommand, ICommandContext } from '../interfaces';

const topCommands: ICommand[] = [
    {
      key: 'new',
      name: 'New',
      iconProps: { iconName: 'Add' },
      isAvailable: (context: ICommandContext) => {
          return context.selectedItems.length === 0;
      },
      loadExecutor: () => import('./executors/newExecutor'),
      dataSourceActionKey: 'CREATE_NEW'
    },
    {
      key: 'upload',
      name: 'Upload',
      iconProps: { iconName: 'Upload' },
      isAvailable: (context: ICommandContext) => {
          return context.selectedItems.length === 0;
      },
      loadExecutor: () => import('./executors/newExecutor'),
      dataSourceActionKey: 'UPLOAD'
    },
    {
      key: 'rename',
      name: 'Rename',
      iconProps: { iconName: 'Edit' },
      isAvailable: (context: ICommandContext) => {
          return context.selectedItems.length === 1;
      },
      loadExecutor: () => import('./executors/renameExecutor'),
      dataSourceActionKey: 'RENAME'
    }
];

export default topCommands;