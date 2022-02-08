import {CommandsEnum} from "./commands.enum";


export interface Message {
    command: CommandsEnum

    data?: any
}
