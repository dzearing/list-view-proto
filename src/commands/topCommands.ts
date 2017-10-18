import { ICommand } from '../interfaces';
import topCommands from '../defaults/topCommands';

let customTopCommands: ICommand[] = [ ...topCommands ];

// remove upload
customTopCommands.splice(1, 1);

// change new
customTopCommands = customTopCommands.map((command: ICommand) => {
    let newCommand = { ...command };
    if (command.key === 'new') {
        newCommand.loadExecutor = () => import('./customNewExecutor');
    }
    return newCommand;
});

export default customTopCommands;