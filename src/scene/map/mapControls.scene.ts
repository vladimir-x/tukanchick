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

    roundLabel: Button
    makeRoadButton: Button
    nextTurnButtonButton: Button

    roundCount: Button
    roadCount: Button
    turnCount: Button


    constructor() {
        super(ScenesEnum.MAP_CONTROLS)

        this.groundA = new Image(this)
        this.groundB = new Image(this)

        this.roundLabel = new Button(this)
        this.makeRoadButton = new Button(this)
        this.nextTurnButtonButton = new Button(this)

        this.roundCount = new Button(this)
        this.roadCount = new Button(this)
        this.turnCount = new Button(this)


    }

    preload() {

        this.groundA.preload(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)
        this.groundB.preload(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)

        this.roundLabel.preload(Assets.SAND_1)
        this.makeRoadButton.preload(Assets.SAND_1)
        this.nextTurnButtonButton.preload(Assets.SAND_1)

        this.roundCount.preload(Assets.SAND_1)
        this.roadCount.preload(Assets.SAND_1)
        this.turnCount.preload(Assets.SAND_1)

        this.turnCount.preload(Assets.SAND_1)

        this.playerInfo = this.scene.settings.data as PlayerInfo
    }

    create() {

        this.roundLabel.create(0, 0, "ROUND").setDisplaySize(100, 50).textGO.setFontSize(20).setColor("black")
        this.roundCount.create(100, 0, "ROUND_COUNT").setDisplaySize(100, 50)
            .textGO.setFontSize(40).setColor("black")


        this.nextTurnButtonButton.create(0, 50, "END-TURN",
            () => MapScene.emitter.emit(EventsEnum.START_TURN)
        ).setDisplaySize(100, 50).textGO.setFontSize(20).setColor("red")

        this.turnCount.create(100, 50, "TURN").setDisplaySize(100, 50)
            .textGO.setFontSize(40).setColor("red")


        this.makeRoadButton.create(0, 100, "MAKE-ROAD",
            () => MapScene.emitter.emit(EventsEnum.MAKE_ROAD)
        ).setDisplaySize(100, 50).textGO.setFontSize(20).setColor("green")

        this.roadCount.create(100, 100, "ROADS").setDisplaySize(100, 50)
            .textGO.setFontSize(40).setColor("red")


        this.roundLabel.imageGO.alpha=0.5
        this.roundCount.imageGO.alpha=0.5

        this.nextTurnButtonButton.imageGO.alpha=0.5
        this.turnCount.imageGO.alpha=0.5

        this.makeRoadButton.imageGO.alpha=0.5
        this.roadCount.imageGO.alpha=0.5


        // const {width, height} = this.scale
        this.groundA.create(500, 0).setDisplaySize(200, 234).imageGO.setScale(0.4, 0.4)
        this.groundB.create(600, 0).setDisplaySize(200, 234).imageGO.setScale(0.4, 0.4)


        MapScene.emitter.on(EventsEnum.START_ROUND_AFTER, this.onStartTurn, this)
       // MapScene.emitter.on(EventsEnum.END_ROUND_AFTER, this.updateScore, this)
        MapScene.emitter.on(EventsEnum.START_TURN_AFTER, this.onStartTurn, this)
        MapScene.emitter.on(EventsEnum.MAKE_ROAD_AFTER, this.onMakeRoad, this)

        this.onStartTurn();
    }

    private onStartTurn() {

        this.turnCount.textGO.text = this.playerInfo.turn.toString()

        this.groundA.changeFrame(this.playerInfo.groundA)
        this.groundB.changeFrame(this.playerInfo.groundB)

        this.updateRoundCount()
        this.updateRoadCounter()

        //this.updateScore()
    }

    private onMakeRoad() {
        this.updateRoadCounter()

        this.groundA.imageGO.setAlpha(0.5)
        this.groundB.imageGO.setAlpha(0.5)
    }


    private updateRoundCount(){
        this.roundCount.textGO.text = this.playerInfo.round.toString()

    }

    private updateRoadCounter() {
        const oneRoad = (this.playerInfo.turnComplete ? 0 : 1)
        this.roadCount.textGO.text = oneRoad.toString() + "+" + this.playerInfo.bonusRoad
    }

   /* private updateScore() {

        if (this.playerInfo.roundScore[0] > 0) {

        }
        if (this.playerInfo.roundScore[1] > 0) {

        }
        if (this.playerInfo.roundScore[2] > 0) {

        }
    }
*/

}
