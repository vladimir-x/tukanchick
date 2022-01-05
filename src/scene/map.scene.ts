import * as Phaser from "phaser";
import {MapConfig} from "../entity/mapConfig";
import {IslandEnum} from "../enums/islands.enum";
import {Assets} from "../Assets";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super("map.scene");
    }

    preload() {

        const mapEntity = this.scene.settings.data as MapConfig


        var mapImageUrl = ""
        switch (mapEntity.island) {
            case IslandEnum.PETIT:
                mapImageUrl = Assets.MAP_ISLAND_PETIT
                break;
            case IslandEnum.GRANDE:
                mapImageUrl = Assets.MAP_ISLAND_GRANDE
                break;

        }

        this.load.image('map', mapImageUrl);
    }

    create() {
        const logo = this.add.image(0, 0, 'map');
    }
}
