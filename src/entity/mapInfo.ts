import {Hexagon} from "./hexagon";
import {ArtifactMapZone} from "./artifactMapZone";
import {TownMapZone} from "./townMapZone";
import {Point} from "./point";

export interface MapInfo {

    scores: Point[]

    artifacts: ArtifactMapZone[]

    towns: TownMapZone[]

    hexagons: Hexagon[]

}
