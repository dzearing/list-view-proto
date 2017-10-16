import { ICommand, ICommandContext } from '../interfaces';

export const execute = (command: ICommand, context: ICommandContext) => {
    alert('running my custom new command');
}