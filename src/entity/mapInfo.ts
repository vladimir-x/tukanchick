import {Hexagon} from "./hexagon";
import {ArtifactMapZone} from "./artifactMapZone";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {TownMapZone} from "./townMapZone";

export interface MapInfo {

    scores: Vector2Like[]

    artifacts: ArtifactMapZone[]

    towns: TownMapZone[]

    hexagons: Hexagon[]

}
