import * as Phaser from "phaser";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Assets} from "../../assets";

export default class LoadScene extends Phaser.Scene {

    constructor() {
        super(ScenesEnum.LOAD_SCREEN)
    }

    preload() {
        this.add.text(0, 0, "LOADING...").setOrigin(0).setFontSize(20).setFontStyle('bold').setColor('red')

        // images
        this.load.image(Assets.MENU_LOGO, Assets.MENU_LOGO);
        this.load.image(Assets.SAND_1, Assets.SAND_1);
        this.load.image(Assets.SCORES_IMAGE, Assets.SCORES_IMAGE);
        this.load.image(Assets.MAP_ISLAND_PETIT, Assets.MAP_ISLAND_PETIT);
        this.load.image(Assets.MAP_ISLAND_GRANDE, Assets.MAP_ISLAND_GRANDE);

        // atlas
        this.load.atlas(Assets.GROUNDS_IMAGE,Assets.GROUNDS_IMAGE, Assets.GROUNDS_JSON);
        this.load.atlas(Assets.STAFF_IMAGE,Assets.STAFF_IMAGE, Assets.STAFF_JSON);

        // configs
        this.load.json(Assets.CONTROLS_INFO, Assets.CONTROLS_INFO)
        this.load.json(Assets.MAPINFO_ISLAND_PETIT, Assets.MAPINFO_ISLAND_PETIT)
        this.load.json(Assets.MAPINFO_ISLAND_GRANDE, Assets.MAPINFO_ISLAND_GRANDE)

    }

    create() {
        this.scene.stop(ScenesEnum.LOAD_SCREEN)
        this.scene.start(ScenesEnum.MAIN_MENU)
    }

    update() {
    }
}
