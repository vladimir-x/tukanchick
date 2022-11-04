import * as Phaser from "phaser";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import MapScene from "./map.scene";
import {EventsEnum} from "../../enums/events.enum";
import {PlayerInfo} from "../../entity/playerInfo";
import {Assets} from "../../assets";
import {Image} from "../../controls/image";
import {EventBus} from "../bus/EventBus";
import {Hexagon} from "../../entity/hexagon";
import {TownLetters} from "../../enums/townLetters";
import {ArtifactsEnum} from "../../enums/artifacts.enum";
import {ControlsInfo} from "../../entity/controlsInfo";

export default class ControlsScene extends Phaser.Scene {

    playerInfo: PlayerInfo

    back: Image

    groundA: Image
    groundB: Image

    bonusRoad: Button

    artifactSplash: Image

    roundLabel: Button
    nextTurnLabel: Button

    roundCount: Button
    deckSizeCount: Button
    turnCount: Button

    artifactZones: Map<string, Image>

    controlsInfo: ControlsInfo

    constructor() {
        super(ScenesEnum.MAP_CONTROLS)

        this.back = new Image(this)

        this.groundA = new Image(this)
        this.groundB = new Image(this)

        this.bonusRoad = new Button(this)

        this.artifactSplash = new Image(this)

        this.roundLabel = new Button(this)
        this.nextTurnLabel = new Button(this)

        this.roundCount = new Button(this)
        this.deckSizeCount = new Button(this)
        this.turnCount = new Button(this)

        this.artifactZones = new Map()

    }

    preload() {

        this.back.preload(Assets.SAND_1)

        this.groundA.preloadAtlas(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)
        this.groundB.preloadAtlas(Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON)

        this.bonusRoad.preload(Assets.SAND_1)

        this.artifactSplash.preloadAtlas(Assets.STAFF_IMAGE, Assets.STAFF_JSON)

        this.roundLabel.preload(Assets.SAND_1)
        this.nextTurnLabel.preload(Assets.SAND_1)

        this.roundCount.preload(Assets.SAND_1)
        this.turnCount.preload(Assets.SAND_1)

        this.load.json(Assets.CONTROLS_INFO, Assets.CONTROLS_INFO)


        for (const a in ArtifactsEnum) {
            if (!a.toString().startsWith("TOWN")) {
                for (let p = 0; p < 3; ++p) {
                    const key: string = a + p.toString()
                    this.artifactZones.set(key, new Image(this).preloadAtlasExtern(Assets.STAFF_IMAGE))
                }
            }
        }
        for (const t in TownLetters) {
            this.artifactZones.set(t, new Image(this).preloadAtlasExtern(Assets.STAFF_IMAGE))
        }


        this.playerInfo = this.scene.settings.data as PlayerInfo
    }

    create() {


        const controlPanelWidth = this.sys.game.canvas.width;
        const controlPanelHeight = 150

        const centerX = controlPanelWidth / 2;

        this.back.create(0, 0).setDisplaySize(controlPanelWidth, controlPanelHeight).setAlphaImage(0.8)

        this.roundLabel.create(0, 0, "ROUND").setDisplaySize(80, 50).setTextFont(20, "black")
        this.roundCount.create(0, 50, "ROUND_COUNT").setDisplaySize(80, 50).setTextFont(40, "black")

        this.nextTurnLabel.create(controlPanelWidth, 0, "END-TURN")
            .setOrigin(1, 0).setDisplaySize(100, 50).setTextFont(20, "red")
        this.turnCount.create(controlPanelWidth, 50, "TURN")
            .setOrigin(1, 0).setDisplaySize(100, 50).setTextFont(40, "red")

        this.deckSizeCount.create(centerX, 0, "_")
            .setOrigin(0.5, 0).setTextFont(40, "green", "bold")


        this.groundA.createAtlas(centerX - 100, 0).setDisplaySize(200, 234).setOrigin(0.5, 0).imageGO.setScale(0.5)
        this.groundB.createAtlas(centerX + 100, 0).setDisplaySize(200, 234).setOrigin(0.5, 0).imageGO.setScale(0.5)

        this.controlsInfo = this.cache.json.get(Assets.CONTROLS_INFO)

        for (const a of this.controlsInfo.artifacts) {
            for (let p = 0; p < a.points.length; ++p) {
                const key: string = a.artifact.toString() + p.toString()
                const img = this.artifactZones.get(key)
                img.createAtlas(centerX + a.points[p].x, a.points[p].y, a.artifact)
                    .imageGO.setScale(0.4).setVisible(false)
            }
        }
        for (const t of this.controlsInfo.towns) {
            const img = this.artifactZones.get(t.letter)
            img.createAtlas(centerX + t.point.x, t.point.y, "TOWN_" + t.letter)
                .imageGO.setScale(0.4).setVisible(false)

        }


        this.bonusRoad.create(centerX, 100, '_').setOrigin(0.5, 0.5)
            .setDisplaySize(500, 100).setTextFont(80, "blue")
            .setAlphaImage(0.5).setVisible(false)

        this.artifactSplash.createAtlas(centerX, controlPanelHeight + 20).setOrigin(0.5, 0)
            .setVisible(false)

        const messages = this.add.text(0, 500, "").setFontSize(80).setFontStyle('bold').setColor("RED")


        EventBus.on(EventsEnum.START_ROUND_AFTER, this.onStartTurn, this)
        // EventBus.on(EventsEnum.END_ROUND_AFTER, this.updateScore, this)
        EventBus.on(EventsEnum.START_TURN_AFTER, this.onStartTurn, this)
        EventBus.on(EventsEnum.MAKE_ROAD_AFTER, this.onMakeRoad, this)

        EventBus.on(EventsEnum.CONNECT_ARTIFACT, this.onConnectArtifact, this)
        EventBus.on(EventsEnum.CONNECT_TOWN, this.onConnectTown, this)
        EventBus.on(EventsEnum.BONUS_ROAD, this.updateRoadCounter, this)

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
        this.deckSizeCount.setText(this.playerInfo.deckSize.toString())

        this.bonusRoad.setText(`FREE-ROAD ${this.playerInfo.bonusRoad}`)
        this.bonusRoad.setVisible(this.playerInfo.bonusRoad > 0)
    }

    private onConnectArtifact(hex: Hexagon) {
        const connectedNumber = this.playerInfo.artifactConnected.get(hex.artifact) - 1
        this.artifactZones.get(hex.artifact + connectedNumber).setVisible(true) // !!!

        this.artifactSplash.changeFrame(hex.artifact).setAlphaImage(1).setVisible(true)

        this.hideArtifactSplash()
    }


    private onConnectTown(townHexes: Hexagon[]) {
        const letter = townHexes[0].townLetter
        this.artifactZones.get(letter).setVisible(true)

        this.artifactSplash.changeFrame(`TOWN_${letter}`).setAlphaImage(1).setVisible(true)

        this.hideArtifactSplash()
    }

    private hideArtifactSplash() {
        this.time.delayedCall(400, () => {
            this.artifactSplash.setAlphaImage(0.7)
        })
        this.time.delayedCall(800, () => {
            this.artifactSplash.setVisible(false)
        })
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
