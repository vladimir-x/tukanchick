import {GroundsEnum} from "../enums/grounds.enum";

export interface PlayerInfo {

    name: string

    turn: number

    turnComplete: boolean

    groundA: GroundsEnum

    groundB: GroundsEnum

    selectA: number

    selectB: number

    bonusRoad: number

}
