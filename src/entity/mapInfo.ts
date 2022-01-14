import {Hexagon} from "./hexagon";
import {ArtifactMapZone} from "./artifactMapZone";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export interface MapInfo {

    scores: Vector2Like[]

    artifacts: ArtifactMapZone[]

    hexagons: Hexagon[]

}
