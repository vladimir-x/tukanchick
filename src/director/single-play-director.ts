import {Director} from "./director";
import {EventBus} from "../scene/bus/EventBus";
import {EventsEnum} from "../enums/events.enum";
import {ScenesEnum} from "../enums/scenes.enum";

export class SinglePlayDirector extends Director {

    constructor(scene: Phaser.Scenes.ScenePlugin) {
        super(scene);


    }

    protected startGame() {
        this.scene.start(ScenesEnum.MAP, this.mapConfig)
    }

    protected initializeMapAfter() {
        EventBus.emit(EventsEnum.START_ROUND)
    }
}
