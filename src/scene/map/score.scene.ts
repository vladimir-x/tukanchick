import * as Phaser from "phaser";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import {EventsEnum} from "../../enums/events.enum";
import {PlayerInfo} from "../../entity/playerInfo";
import {Assets} from "../../assets";
import {Image} from "../../controls/image";
import {EventBus} from "../bus/EventBus";
import {ScoreZonesEnum} from "../../enums/scoreZones.enum";

export default class ScoreScene extends Phaser.Scene {

    playerInfo: PlayerInfo

    back: Image

    next: Button

    message: Button

    //очки
    scoreZones: Button[]


    constructor() {
        super(ScenesEnum.SCORE)

        this.back = new Image(this)

        this.message = new Button(this)
        this.next = new Button(this)

        this.scoreZones = []
        for (const z in ScoreZonesEnum) {
            this.scoreZones[z] = new Button(this)
        }

    }

    preload() {

        this.back.preload(Assets.SCORES_IMAGE)

        this.message.preload(Assets.SAND_1)
        this.next.preload(Assets.SAND_1)


        this.playerInfo = this.scene.settings.data as PlayerInfo
    }

    create() {

        const scorePanelWidth = 400;
        const scorePanelHeight = 300;

        const centerX = this.sys.game.canvas.width / 2;
        const centerY = this.sys.game.canvas.height / 2;

        this.back.create(centerX, centerY).setOrigin(0.5, 0.5).imageGO.setScale(0.7)

        this.message.create(centerX, centerY - 200, "___").setOrigin(0.5, 0)
            .setDisplaySize(400, 50).setTextFont(40, "blue")


        let posY =  centerY - scorePanelHeight / 2 + 50

        this.scoreZones[ScoreZonesEnum.ROUND0].create(centerX - 150, posY - 20, "___").setTextFont(50, "black")
        this.scoreZones[ScoreZonesEnum.ROUND1].create(centerX - 150, posY + 80, "___").setTextFont(50, "black")
        this.scoreZones[ScoreZonesEnum.ROUND2].create(centerX - 150, posY + 180, "___").setTextFont(50, "black")
        this.scoreZones[ScoreZonesEnum.TOWN].create(centerX + 100, posY - 20, "___").setTextFont(50, "black")
        this.scoreZones[ScoreZonesEnum.TOTAL].create(centerX + 100, posY + 180, "___").setTextFont(50, "black")

        this.next.create(centerX, centerY + 200, 'NEXT', () => this.onNext()).setOrigin(0.5, 0.5)
            .setDisplaySize(190, 100).setTextFont(80, "blue")


        this.show();
    }

    show() {
        // score by rounds
        for (let i = 0; i < 3; ++i) {
            const roundScore = this.playerInfo.scores[i]?.toString()
            if (roundScore) {
                this.scoreZones[i].setText(roundScore)
            } else {
                this.scoreZones[i].setText("")
            }
        }

        if (this.playerInfo.gameEnd){
            this.scoreZones[ScoreZonesEnum.TOWN].setText(this.playerInfo.scores[ScoreZonesEnum.TOWN].toString())
            this.scoreZones[ScoreZonesEnum.TOTAL].setText(this.playerInfo.scores[ScoreZonesEnum.TOTAL].toString())


            this.message.setText("GAME END")
            this.next.setText("EXIT")
        } else {
            this.message.setText(`ROUND ${this.playerInfo.round} COMPLETE`)
            this.next.setText("NEXT")
        }

        this.scene.setVisible(true);
    }


    onNext() {

        this.scene.setVisible(false);

        if (this.playerInfo.gameEnd){
            EventBus.emit(EventsEnum.CLOSE_GAME)
        } else {
            EventBus.emit(EventsEnum.START_ROUND)
        }

        this.scene.stop()

    }

}
