import * as Phaser from "phaser";
import {IslandEnum} from "../enums/islands.enum";
import {ScenesEnum} from "../enums/scenes.enum";
import {Button} from "../controls/button";

export default class MainMenuScene extends Phaser.Scene {


    petitButton: Button
    grandeButton: Button

    constructor() {
        super(ScenesEnum.MAIN_MENU)

        this.petitButton = new Button(this)
        this.grandeButton = new Button(this)
    }

    preload() {

        this.petitButton.preload('menu-select-isla-petit-button')
        this.grandeButton.preload('menu-select-isla-grande-button')
    }

    create() {
        const {width, height} = this.scale

        let buttonWidth = 150
        let buttonHeight = 50
        let buttonSpace = 10

        this.petitButton.create(width * 0.5, height * 0.6,
            'Isla petit (2)',
            () => this.scene.start(ScenesEnum.MAP, {island: IslandEnum.PETIT})
        ).imageGO.setDisplaySize(buttonWidth, buttonHeight)


        this.grandeButton.create(width * 0.5, height * 0.6 + buttonHeight + buttonSpace,
            'Isla grande (3)',
            () => this.scene.start(ScenesEnum.MAP, {island: IslandEnum.GRANDE})
        ).imageGO.setDisplaySize(buttonWidth, buttonHeight)

    }

    update() {
    }
}
