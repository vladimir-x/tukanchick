import {GroundsEnum} from "../enums/grounds.enum";

export interface PlayerInfo {

    name: string

    turn: number

    round: number

    turnComplete: boolean

    groundA?: GroundsEnum

    groundB?: GroundsEnum

    selectA?: number

    selectGroundA?: GroundsEnum

    selectGroundB?: GroundsEnum

    selectB?: number

    bonusRoad: number

    roundScore: number[]
}
