import {EventBus} from "../scene/bus/EventBus";
import {EventsEnum} from "../enums/events.enum";
import {MapConfig} from "../entity/mapConfig";

export abstract class Director {

    private _mapConfig: MapConfig

    constructor(protected scene: Phaser.Scenes.ScenePlugin) {
        EventBus.clear()


        // начало игры
        EventBus.on(EventsEnum.START_GAME, this.startGame, this)

        //
        EventBus.on(EventsEnum.INITIALIZE_MAP_AFTER, this.initializeMapAfter, this)
    }


    get mapConfig(): MapConfig {
        return this._mapConfig;
    }

    set mapConfig(value: MapConfig) {
        this._mapConfig = value;
    }

    protected initializeMapAfter() {
    }

    protected startGame() {
    }
}
