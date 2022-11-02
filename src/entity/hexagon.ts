import {GroundsEnum} from "../enums/grounds.enum";
import {ArtifactsEnum} from "../enums/artifacts.enum";
import {TownLetters} from "../enums/townLetters";
import {Point} from "./point";


export interface Hexagon {
    index: number;

    points: Point[];

    neighbours: number[];

    ground: GroundsEnum

    artifact: ArtifactsEnum

    net?: number

    artifactConnected?: boolean

    isSelected?: boolean

    townLetter?: TownLetters

}
