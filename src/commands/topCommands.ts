import { ICommand } from '../interfaces';
import topCommands from '../defaults/topCommands';

let customTopCommands: ICommand[] = topCommands.map((command: ICommand) => {
    if (command.key === 'new') {
        command.loadExecutor = () => import('./customNewExecutor');
    }
    return command;
});

export default customTopCommands;