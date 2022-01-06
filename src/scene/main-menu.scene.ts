import * as Phaser from "phaser";
import {MapConfig} from "../entity/mapConfig";
import {IslandEnum} from "../enums/islands.enum";
import {ScenesEnum} from "../enums/scenes.enum";

export default class MainMenuScene extends Phaser.Scene {

    constructor() {
        super(ScenesEnum.MAIN_MENU)
    }

    preload() {

    }

    create() {
        const {width, height} = this.scale

        const playPetitButton = this.add.image(width * 0.5, height * 0.6, 'menu-select-isla-petit-button')
            .setDisplaySize(150, 50)

        this.add.text(playPetitButton.x, playPetitButton.y, 'Isla petit (2)').setOrigin(0.5)


        const playGrandeButton = this.add.image(playPetitButton.x, playPetitButton.y + playPetitButton.displayHeight + 10, 'menu-select-isla-grande-button')
            .setDisplaySize(150, 50)

        this.add.text(playGrandeButton.x, playGrandeButton.y, 'Isla grande (3)')
            .setOrigin(0.5)


        // ------


        playPetitButton.setInteractive().on("pointerup", () => {
            this.scene.start(ScenesEnum.MAP, new MapConfig(IslandEnum.PETIT))
        })

        playGrandeButton.setInteractive().on("pointerup", () => {
            this.scene.start(ScenesEnum.MAP, new MapConfig(IslandEnum.GRANDE))
        })

        this.scale.startFullscreen()

    }

    update() {
    }
}
