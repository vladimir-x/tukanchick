import * as Phaser from "phaser";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import MapScene from "./map.scene";
import {EventsEnum} from "../../enums/events.enum";
import {PlayerInfo} from "../../entity/playerInfo";
import {Assets} from "../../assets";
import {Image} from "../../controls/image";
import {EventBus} from "../bus/EventBus";

export default class MapControlsScene extends Phaser.Scene {

    playerInfo: PlayerInfo

    back: Image

    groundA: Image
    groundB: Image

    bonusRoad: Button

    roundLabel: Button
    deckSizeLabel: Button
    nextTurnLabel: Button

    roundCount: Button
    deckSizeCount: Button
    turnCount: Button


    constructor() {
        super(ScenesEnum.MAP_CONTROLS)

        this.back = new Image(this)

        this.groundA = new Image(this)
        this.groundB = new Image(this)

        this.bonusRoad = new Button(this)

        this.roundLabel = new Button(this)
        this.deckSizeLabel = new Button(this)
        this.nextTurnLabel = new Button(this)

        this.roundCount = new Button(this)
        this.deckSizeCount = new Button(this)
        this.turnCount = new Button(this)


    }

    preload() {

        this.back.preload(Assets.SAND_1)

        this.groundA.preloadAtlas(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)
        this.groundB.preloadAtlas(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)

        this.bonusRoad.preload(Assets.SAND_1)

        this.roundLabel.preload(Assets.SAND_1)
        this.deckSizeLabel.preload(Assets.SAND_1)
        this.nextTurnLabel.preload(Assets.SAND_1)

        this.roundCount.preload(Assets.SAND_1)
        this.deckSizeCount.preload(Assets.SAND_1)
        this.turnCount.preload(Assets.SAND_1)

        this.turnCount.preload(Assets.SAND_1)

        this.playerInfo = this.scene.settings.data as PlayerInfo
    }

    create() {


        const controlPanelWidth = this.sys.game.canvas.width;
        const controlPanelHeight = 150

        const centerX = controlPanelWidth / 2;

        this.back.create(0, 0).setDisplaySize(controlPanelWidth, controlPanelHeight).setAlphaImage(0.8)

        this.roundLabel.create(0, 0, "ROUND").setDisplaySize(100, 50).setTextFont(20, "black").setAlphaImage(0.5)
        this.roundCount.create(100, 0, "ROUND_COUNT").setDisplaySize(100, 50).setTextFont(40, "black").setAlphaImage(0.5)

        this.nextTurnLabel.create(0, 50, "END-TURN").setDisplaySize(100, 50).setTextFont(20, "red").setAlphaImage(0.5)
        this.turnCount.create(100, 50, "TURN").setDisplaySize(100, 50).setTextFont(40, "red").setAlphaImage(0.5)

        this.deckSizeLabel.create(0, 100, "DECK-SIZE").setDisplaySize(100, 50).setTextFont(20, "green").setAlphaImage(0.5)
        this.deckSizeCount.create(100, 100, "_").setDisplaySize(100, 50).setTextFont(40, "green").setAlphaImage(0.5)


        this.groundA.createAtlas(centerX - 100, 0).setDisplaySize(200, 234).setOrigin(0.5, 0).imageGO.setScale(0.5)
        this.groundB.createAtlas(centerX + 100, 0).setDisplaySize(200, 234).setOrigin(0.5, 0).imageGO.setScale(0.5)

        this.bonusRoad.create(centerX, 0, '_').setOrigin(0.5, 0)
            .setDisplaySize(500, controlPanelHeight).setTextFont(80, "blue")
            .setAlphaImage(0.5).setVisible(false)

        const messages = this.add.text(0, 500, "").setFontSize(80).setFontStyle('bold').setColor("RED")


        EventBus.on(EventsEnum.START_ROUND_AFTER, this.onStartTurn, this)
        // EventBus.on(EventsEnum.END_ROUND_AFTER, this.updateScore, this)
        EventBus.on(EventsEnum.START_TURN_AFTER, this.onStartTurn, this)
        EventBus.on(EventsEnum.MAKE_ROAD_AFTER, this.onMakeRoad, this)


        let number = 0
        let messageLog = ''
        EventBus.on(EventsEnum.MESSAGE, (msg: string) => {
            messageLog = number + " " + msg + "\n" + messageLog
            number++
            messages.setText(messageLog.split("\n").slice(0, 10))
        }, this)

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


    private updateRoundCount() {
        this.roundCount.textGO.text = this.playerInfo.round.toString()

    }

    private updateRoadCounter() {
        const oneRoad = (this.playerInfo.turnComplete ? 0 : 1)
        this.deckSizeCount.setText(this.playerInfo.deckSize.toString())

        this.bonusRoad.setText(`FREE-ROAD ${this.playerInfo.bonusRoad}`)
        this.bonusRoad.setVisible(this.playerInfo.bonusRoad > 0)
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
