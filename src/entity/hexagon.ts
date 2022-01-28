import Vector2Like = Phaser.Types.Math.Vector2Like;
import {GroundsEnum} from "../enums/grounds.enum";
import {ArtifactsEnum} from "../enums/artifacts.enum";
import {TownLetters} from "../enums/townLetters";


export interface Hexagon {
    index: number;

    points: Vector2Like[];

    neighbours: number[];

    ground: GroundsEnum

    artifact: ArtifactsEnum

    net?: number

    artifactConnected?: boolean

    isSelected?: boolean

    townLetter?: TownLetters

}
