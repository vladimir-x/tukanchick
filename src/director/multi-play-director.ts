import {Director} from "./director";
import {ScenesEnum} from "../enums/scenes.enum";
import {MapConfig} from "../entity/mapConfig";

export class MultiPlayDirector extends Director {

    protected startGame(mapConfig: MapConfig) {
        this.scene.start(ScenesEnum.MAP, mapConfig)
    }


    protected initializeMapAfter() {
    }
}
