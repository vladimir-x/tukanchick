import * as Phaser from "phaser";
import {MapConfig} from "../entity/mapConfig";
import {IslandEnum} from "../enums/islands.enum";
import {Assets} from "../assets";
import {ScenesEnum} from "../enums/scenes.enum";
import {configCamera} from "../camera";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super(ScenesEnum.MAP);
    }

    mapConfig: MapConfig;

    preload() {

        this.mapConfig = this.getConfigOrDefault()


        let mapImageUrl = "";
        switch (this.mapConfig.island) {
            case IslandEnum.PETIT:
                mapImageUrl = Assets.MAP_ISLAND_PETIT
                break;
            case IslandEnum.GRANDE:
                mapImageUrl = Assets.MAP_ISLAND_GRANDE
                break;

        }

        this.textures.remove("map")

        this.load.image("map", mapImageUrl);
    }

    create() {
        const map = this.add.image(0, 0, "map");
        map.setOrigin(0, 0)

        const maxWidth = map.width * map.scaleX
        const maxHeight = map.height * map.scaleY

        configCamera(this, maxWidth, maxHeight)
    }

    private getConfigOrDefault(): MapConfig {

        const res = this.scene.settings.data as MapConfig;
        if (res.island) {
            return res
        } else {
            return new MapConfig(IslandEnum.PETIT)

        }
    }
}
