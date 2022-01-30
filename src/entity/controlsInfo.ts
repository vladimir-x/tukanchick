import {ArtifactMapZone} from "./artifactMapZone";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {TownMapZone} from "./townMapZone";

export interface ControlsInfo {

    scores: Vector2Like[]

    artifacts: ArtifactMapZone[]

    towns: TownMapZone[]


}
