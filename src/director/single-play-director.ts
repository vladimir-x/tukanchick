import {Director} from "./director";
import {EventBus} from "../scene/bus/EventBus";
import {EventsEnum} from "../enums/events.enum";
import {ScenesEnum} from "../enums/scenes.enum";
import {MapConfig} from "../entity/mapConfig";

export class SinglePlayDirector extends Director {

    constructor(scene: Phaser.Scenes.ScenePlugin) {
        super(scene);


    }

    protected startGame(mapConfig: MapConfig) {
        this.scene.start(ScenesEnum.MAP, mapConfig)
    }

    protected initializeMapAfter() {
        EventBus.emit(EventsEnum.START_ROUND)
    }
}
