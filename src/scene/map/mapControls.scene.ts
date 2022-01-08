import * as Phaser from "phaser";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import MapScene from "./map.scene";
import {EventsEnum} from "../../enums/events.enum";
import {PlayerInfo} from "../../entity/playerInfo";
import {Assets} from "../../assets";
import {Image} from "../../controls/image";
import {GroundsEnum} from "../../enums/grounds.enum";

export default class MapControlsScene extends Phaser.Scene {

    playerInfo: PlayerInfo

    groundA: Image
    groundB: Image

    makeRoadButton: Button
    nextTurnButtonButton: Button

    roadCount: Button
    turnCount: Button

    constructor() {
        super(ScenesEnum.MAP_CONTROLS)

        this.groundA = new Image(this)
        this.groundB = new Image(this)

        this.makeRoadButton = new Button(this)
        this.nextTurnButtonButton = new Button(this)

        this.roadCount = new Button(this)
        this.turnCount = new Button(this)

    }

    preload() {

        this.groundA.preload(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)
        this.groundB.preload(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)

        this.makeRoadButton.preload(Assets.SAND_1)
        this.nextTurnButtonButton.preload(Assets.SAND_1)
        this.roadCount.preload(Assets.SAND_1)
        this.turnCount.preload(Assets.SAND_1)

        this.playerInfo = this.scene.settings.data as PlayerInfo
    }

    create() {

        // const {width, height} = this.scale
        this.groundA.create(300, 0).setDisplaySize(200, 234).imageGO.setScale(0.5, 0.5)
        this.groundB.create(420, 0).setDisplaySize(200, 234).imageGO.setScale(0.5, 0.5)


        this.makeRoadButton.create(100, 120, "MAKE-ROAD",
            () => MapScene.emitter.emit(EventsEnum.MAKE_ROAD)
        ).setDisplaySize(150, 50).textGO.setFontSize(20).setColor("green")

        this.roadCount.create(260, 120, "ROADS").setDisplaySize(40, 50)
            .textGO.setFontSize(50).setColor("red")

        this.makeRoadButton.create(450, 120, "END-TURN",
            () => MapScene.emitter.emit(EventsEnum.START_TURN)
        ).setDisplaySize(150, 50).textGO.setFontSize(20).setColor("red")

        this.turnCount.create(610, 120, "TURN").setDisplaySize(40, 50)
            .textGO.setFontSize(50).setColor("red")

        MapScene.emitter.on(EventsEnum.START_TURN_AFTER, this.updateAfterTurnCounter, this)
        MapScene.emitter.on(EventsEnum.MAKE_ROAD_AFTER, this.updateRoadCounter, this)

        MapScene.emitter.emit(EventsEnum.START_TURN)
    }

    private updateAfterTurnCounter() {
        this.turnCount.textGO.text = this.playerInfo.turn.toString()

        this.groundA.changeFrame(this.playerInfo.groundA)
        this.groundB.changeFrame(this.playerInfo.groundB)

        this.updateRoadCounter()
    }

    private updateRoadCounter() {
        const roadsForCurrentTurnCount = (this.playerInfo.turnComplete ? 0 : 1) + this.playerInfo.bonusRoad
        this.roadCount.textGO.text = roadsForCurrentTurnCount.toString()

        if (roadsForCurrentTurnCount === 0) {
            console.log("autostart next turn")
            MapScene.emitter.emit(EventsEnum.START_TURN)
        }
    }


}
