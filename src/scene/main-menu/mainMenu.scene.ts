import * as Phaser from "phaser";
import {IslandEnum} from "../../enums/islands.enum";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import {Assets} from "../../assets";
import {MapConfig} from "../../entity/mapConfig";
import {Image} from "../../controls/image";

export default class MainMenuScene extends Phaser.Scene {


    background: Image


    petitButton: Button
    grandeButton: Button

    constructor() {
        super(ScenesEnum.MAIN_MENU)

        this.background = new Image(this)
        this.petitButton = new Button(this)
        this.grandeButton = new Button(this)
    }

    preload() {

        this.background.preload(Assets.MENU_LOGO)
        this.petitButton.preloadAtlas(Assets.STAFF_IMAGE, Assets.STAFF_JSON)
        this.grandeButton.preloadAtlas(Assets.STAFF_IMAGE, Assets.STAFF_JSON)
    }

    create() {

        this.background.create(0, 0)
        const {width, height} = this.background.imageGO

        let buttonWidth = 600 * 0.5
        let buttonHeight = 200 * 0.5
        let buttonSpace = 10

        this.petitButton.create(width * 0.5, height * 0.3,
            null,
            () => this.scene.start(ScenesEnum.MAP, {island: IslandEnum.PETIT, roundCount: 2} as MapConfig)
        ).changeFrame('ISLA_PETIT').setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5, 0)


        this.grandeButton.create(width * 0.5, height * 0.3 + buttonHeight + buttonSpace,
            null,
            () => this.scene.start(ScenesEnum.MAP, {island: IslandEnum.GRANDE, roundCount: 3} as MapConfig)
        ).changeFrame('ISLA_GRANDE').setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5, 0)


        this.add.text(0, 0, "ver " + "0.0.3").setOrigin(0).setFontSize(20).setFontStyle('bold').setColor('black')
    }

    update() {
    }
}
