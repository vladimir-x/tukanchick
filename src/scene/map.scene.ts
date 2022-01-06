import * as Phaser from "phaser";
import {MapConfig} from "../entity/mapConfig";
import {IslandEnum} from "../enums/islands.enum";
import {Assets} from "../assets";
import {ScenesEnum} from "../enums/scenes.enum";
import {configCamera} from "../camera";
import {Hexagon} from "../entity/hexagon";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super(ScenesEnum.MAP);
    }

    mapConfig: MapConfig;

    hexagons: Hexagon[];

    selected: Set<Hexagon>;

    preload() {

        this.mapConfig = this.getConfigOrDefault()

        this.textures.remove("map")
        this.cache.json.remove("hexagons")

        switch (this.mapConfig.island) {
            case IslandEnum.PETIT:
                this.load.image("map", Assets.MAP_ISLAND_PETIT);
                this.load.json("hexagons", Assets.HEXAGONS_ISLAND_PETIT)
                break;
            case IslandEnum.GRANDE:
                this.load.image("map", Assets.MAP_ISLAND_GRANDE);
                this.load.json("hexagons", Assets.HEXAGONS_ISLAND_GRANDE)
                break;

        }

    }

    create(hexagon: Hexagon) {
        const map = this.add.image(0, 0, "map").setOrigin(0, 0)

        this.hexagons = this.cache.json.get("hexagons");

        //this.hexagons = calculatePoints(this.cache.json.get("hexagons")[0], this.mapConfig.island);
        //this.drawHexagons();

        this.hexagons.forEach((h) => {
                let downX = 0
                let downY = 0

                h.polygonGeom = new Phaser.Geom.Polygon(h.points)
                h.polygonGameObject = this.add.polygon(0, 0, h.points).setOrigin(0, 0)

                h.polygonGameObject
                    .setInteractive(h.polygonGeom,
                        (hitArea: Phaser.Geom.Polygon, x: number, y: number) => hitArea.contains(x, y))
                    .on('pointerdown', (pointer: any, localX: any, localY: any, event: any) => {
                        downX = localX
                        downY = localY
                    })
                    .on('pointerup', (pointer: any, localX: any, localY: any, event: any) => {
                        if (downX == localX && downY == localY) {

                            this.onClick(h)
                        }
                    })
            }
        )

        this.selected = new Set<Hexagon>()

        configCamera(this, map.width, map.height)
    }

    update(time: number, delta: number) {
    }

    private onClick(hexagon: Hexagon) {

        if (this.selected.has(hexagon)) {
            this.removeFromSelected(hexagon)
        } else if (this.selected.size < 2) {
            this.addToSelected(hexagon)
        }
    }

    private addToSelected(hexagon: Hexagon) {
        this.selected.add(hexagon)
        hexagon.polygonGameObject.setFillStyle(0x61b65f, 0.6)
    }

    private removeFromSelected(hexagon: Hexagon) {
        this.selected.delete(hexagon)
        hexagon.polygonGameObject.isFilled = false
    }

    private clearSelected(hexagon: Hexagon) {
        this.selected.forEach((h) =>
            h.polygonGameObject.isFilled = false
        )
        this.selected.clear()
    }


    private drawHexagons() {
        this.hexagons.forEach((hexagon) => {
            for (let i = 0; i < hexagon.points.length; ++i) {
                let a = hexagon.points[i];
                let b = i + 1 < hexagon.points.length ? hexagon.points[i + 1] : hexagon.points[0]

                this.add.line(0, 0, a.x, a.y, b.x, b.y, 0xff0000).setOrigin(0, 0)
            }
            //
            this.add.text(hexagon.points[0].x - 10, hexagon.points[0].y + 10, hexagon.index.toString())
                .setOrigin(0, 0)
                .setColor("#000000")
                .setFontSize(50)
        })
    }


    private getConfigOrDefault(): MapConfig {

        const res = this.scene.settings.data as MapConfig;
        if (res.island) {
            return res
        } else {
            return {
                island: IslandEnum.GRANDE
            }
        }
    }
}
