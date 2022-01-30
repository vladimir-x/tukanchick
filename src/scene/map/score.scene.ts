import * as Phaser from "phaser";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import {EventsEnum} from "../../enums/events.enum";
import {PlayerInfo} from "../../entity/playerInfo";
import {Assets} from "../../assets";
import {Image} from "../../controls/image";
import {EventBus} from "../bus/EventBus";

export default class ScoreScene extends Phaser.Scene {

    playerInfo: PlayerInfo

    back: Image

    next: Button

    message: Button



    constructor() {
        super(ScenesEnum.SCORE)

        this.back = new Image(this)

        this.message = new Button(this)
        this.next = new Button(this)

    }

    preload() {

        this.back.preload(Assets.SAND_1)

        this.next.preload(Assets.SAND_1)

        this.playerInfo = this.scene.settings.data as PlayerInfo
    }

    create() {

        const scorePanelWidth = 400;
        const scorePanelHeight = 300;

        const centerX = this.sys.game.canvas.width / 2;
        const centerY = this.sys.game.canvas.height / 2;

        this.back.create(centerX, centerY).setDisplaySize(scorePanelWidth, scorePanelHeight).setAlphaImage(0.8).setOrigin(0.5, 0.5)

        this.message.create(centerX, centerY - scorePanelHeight / 2, "_").setOrigin(0.5, 0)
            .setDisplaySize(180, 100).setTextFont(40, "blue")

        this.next.create(centerX, centerY + scorePanelHeight / 2, 'NEXT', () => this.onNext()).setOrigin(0.5, 0.5)
            .setDisplaySize(180, 100).setTextFont(80, "blue")


        EventBus.on(EventsEnum.END_ROUND_AFTER, this.show, this)
        EventBus.on(EventsEnum.END_GAME_AFTER, this.show, this)

        this.scene.setVisible(false);
    }

    show() {
        this.scene.setVisible(true);

        if (this.playerInfo.gameEnd){
            this.message.setText("GAME END")
            this.next.setText("EXIT")
        } else {
            this.message.setText(`ROUND ${this.playerInfo.round} COMPLETE`)
            this.next.setText("NEXT")
        }
    }


    onNext() {
        this.scene.setVisible(false);

        if (this.playerInfo.gameEnd){
            EventBus.emit(EventsEnum.CLOSE_GAME)
        } else {
            EventBus.emit(EventsEnum.START_ROUND)
        }

    }

}
