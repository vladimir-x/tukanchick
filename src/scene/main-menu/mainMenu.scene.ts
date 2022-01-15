import * as Phaser from "phaser";
import {IslandEnum} from "../../enums/islands.enum";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import {Assets} from "../../assets";
import {MapConfig} from "../../entity/mapConfig";

export default class MainMenuScene extends Phaser.Scene {


    background: Button


    petitButton: Button
    grandeButton: Button

    constructor() {
        super(ScenesEnum.MAIN_MENU)

        this.background = new Button(this)
        this.petitButton = new Button(this)
        this.grandeButton = new Button(this)
    }

    preload() {

        this.background.preload(Assets.MENU_LOGO)
        this.petitButton.preload(Assets.SAND_1)
        this.grandeButton.preload(Assets.SAND_1)
    }

    create() {

        this.background.create(0, 0)
        const {width, height} = this.background.imageGO

        let buttonWidth = 200
        let buttonHeight = 50
        let buttonSpace = 10

        this.petitButton.create(width * 0.5, height * 0.6,
            'Isla petit (2)',
            () => this.scene.start(ScenesEnum.MAP, {island: IslandEnum.PETIT, roundCount: 2} as MapConfig)
        ).setDisplaySize(buttonWidth, buttonHeight).textGO.setFontSize(20).setColor("red")


        this.grandeButton.create(width * 0.5, height * 0.6 + buttonHeight + buttonSpace,
            'Isla grande (3)',
            () => this.scene.start(ScenesEnum.MAP, {island: IslandEnum.GRANDE, roundCount: 3} as MapConfig)
        ).setDisplaySize(buttonWidth, buttonHeight).textGO.setFontSize(20).setColor("red")

        this.add.text(0, 0, "ver" + "0.0.1").setOrigin(0)
    }

    update() {
    }
}
