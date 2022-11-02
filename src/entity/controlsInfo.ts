import {ArtifactMapZone} from "./artifactMapZone";
import {TownMapZone} from "./townMapZone";
import {Point} from "./point";

export interface ControlsInfo {

    scores: Point[]

    artifacts: ArtifactMapZone[]

    towns: TownMapZone[]


}
