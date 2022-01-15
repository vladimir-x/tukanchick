import Vector2Like = Phaser.Types.Math.Vector2Like;
import {TownLetters} from "../enums/townLetters";

export interface TownMapZone {

    letter: TownLetters

    point: Vector2Like

    score: number

}
