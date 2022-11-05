import {EventBus} from "../scene/bus/EventBus";
import {EventsEnum} from "../enums/events.enum";
import {MapConfig} from "../entity/mapConfig";
import {Hexagon} from "../entity/hexagon";

export abstract class Director {


    constructor(protected scene: Phaser.Scenes.ScenePlugin) {
        EventBus.clear()


        // начало игры
        EventBus.on(EventsEnum.START_GAME, this.startGame, this)

        EventBus.on(EventsEnum.START_ROUND, this.startRound, this)
        EventBus.on(EventsEnum.START_TURN, this.startTurn, this)
        EventBus.on(EventsEnum.END_TURN, this.endTurn, this)
        EventBus.on(EventsEnum.END_ROUND, this.endRound, this)

        EventBus.on(EventsEnum.MAKE_ROAD, this.makeRoad, this)

        EventBus.on(EventsEnum.CLOSE_GAME, this.closeGame, this)
        //
        EventBus.on(EventsEnum.INITIALIZE_MAP_AFTER, this.initializeMapAfter, this)
    }

    protected initializeMapAfter() {
    }

    protected startGame(mapConfig: MapConfig) {
    }

    protected startRound() {
    }

    protected startTurn() {
    }

    protected endTurn() {
    }

    protected endRound() {
    }


    protected makeRoad(hexes: Hexagon[]) {
    }

    protected closeGame() {
    }
}
