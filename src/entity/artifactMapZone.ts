import {ArtifactsEnum} from "../enums/artifacts.enum";
import {Point} from "./point";

export interface ArtifactMapZone {

    artifact: ArtifactsEnum

    points: Point[]

    score: number[]

}
