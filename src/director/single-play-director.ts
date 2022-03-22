import {Director} from "./director";
import {EventBus} from "../scene/bus/EventBus";
import {EventsEnum} from "../enums/events.enum";
import {ScenesEnum} from "../enums/scenes.enum";
import {MapConfig} from "../entity/mapConfig";
import {PlayerInfo} from "../entity/playerInfo";
import {getRandom} from "../scene/map/map.util";
import Deck from "../scene/map/deck";

export class SinglePlayDirector extends Director {

    playerInfo: PlayerInfo

    // колода кароточек с землями
    deck: Deck

    constructor(scene: Phaser.Scenes.ScenePlugin) {
        super(scene);
    }

    protected startGame(mapConfig: MapConfig) {
        this.scene.start(ScenesEnum.MAP, mapConfig)


        this.playerInfo = this.initPlayer("PLAYER_" + getRandom(10))
    }

    protected initializeMapAfter() {
        EventBus.emit(EventsEnum.START_ROUND)
    }

    protected startRound() {
        this.deck = new Deck()
        this.playerInfo.round += 1
        this.playerInfo.turn = 0

        EventBus.emit(EventsEnum.START_ROUND_AFTER)
        EventBus.emit(EventsEnum.START_TURN)
    }


    protected startTurn() {

        this.playerInfo.groundA = this.deck.pop()
        this.playerInfo.groundB = this.deck.pop()

        this.playerInfo.turn++
        this.playerInfo.turnComplete = false
        this.playerInfo.readyTouch = true

        this.playerInfo.deckSize = this.deck.size()

        EventBus.emit(EventsEnum.START_TURN_AFTER)
    }


    protected endTurn() {
        const mapScene = this.scene.get(ScenesEnum.MAP)

        if (this.deck.size() > 1) {
            EventBus.emitDelayed(mapScene, 300, EventsEnum.START_TURN)
        } else {
            EventBus.emitDelayed(mapScene, 300, EventsEnum.END_ROUND)
        }
    }

// --------------------------


    private initPlayer(name: string): PlayerInfo {
        return {
            deckSize: 0,
            gameEnd: false,
            readyTouch: false,
            name: name, turn: 0, round: 0, bonusRoad: 0, turnComplete: false, scores: [],
            artifactConnected: new Map()
        }
    }
}
