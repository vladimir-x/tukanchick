import {ArtifactsEnum} from "../enums/artifacts.enum";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export interface ArtifactMapZone {

    artifact: ArtifactsEnum

    points: Vector2Like[]

    score: number[]

}
