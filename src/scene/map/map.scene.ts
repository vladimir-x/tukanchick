import * as Phaser from "phaser";
import {MapConfig} from "../../entity/mapConfig";
import {IslandEnum} from "../../enums/islands.enum";
import {Assets} from "../../assets";
import {ScenesEnum} from "../../enums/scenes.enum";
import {configCamera} from "./camera";
import {Hexagon} from "../../entity/hexagon";
import {PlayerInfo} from "../../entity/playerInfo";
import {EventsEnum} from "../../enums/events.enum";
import Deck from "./deck";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export default class MapScene extends Phaser.Scene {

    static emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()


    mapConfig: MapConfig

    hexagons: Map<number, Hexagon>

    polygonGeoms: Map<number, Phaser.Geom.Polygon>

    polygonGameObjects: Map<number, Phaser.GameObjects.Polygon>

    playerInfo: PlayerInfo

    roads: Map<number, number>

    deck: Deck

    constructor() {
        super(ScenesEnum.MAP);

        MapScene.emitter.destroy()
    }

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

    create() {
        const map = this.add.image(0, 0, "map").setOrigin(0, 0)

        this.hexagons = new Map()

        const arrayHexagons: Hexagon[] = this.cache.json.get("hexagons")
        arrayHexagons.forEach((h) => {
            this.hexagons.set(h.index, h)
        })


        this.polygonGeoms = new Map()

        this.polygonGameObjects = new Map()

        this.hexagons.forEach((h) => {

                let downX = 0
                let downY = 0

                const polygonGeom = new Phaser.Geom.Polygon(h.points)
                const polygonGameObject = this.add.polygon(0, 0, h.points).setOrigin(0, 0)

                this.polygonGeoms.set(h.index, polygonGeom)
                this.polygonGameObjects.set(h.index, polygonGameObject)

                //this.drawHexagons(h)

                polygonGameObject
                    .setInteractive(polygonGeom,
                        (hitArea: Phaser.Geom.Polygon, x: number, y: number) => hitArea.contains(x, y))
                    .on('pointerdown', (pointer: any, localX: any, localY: any) => {
                        downX = localX
                        downY = localY
                    })
                    .on('pointerup', (pointer: any, localX: any, localY: any) => {
                        if (downX == localX && downY == localY) {

                            this.onClick(h)
                        }
                    })
            }
        )


        //----

        this.playerInfo = this.initPlayer("PLAYER")

        this.roads = new Map()

        this.deck = new Deck()

        this.scene.launch(ScenesEnum.MAP_CONTROLS, this.playerInfo)

        MapScene.emitter.on(EventsEnum.MAKE_ROAD, this.makeRoad, this)
        MapScene.emitter.on(EventsEnum.START_TURN, this.startTurn, this)

        //----
        configCamera(this, map.width, map.height)

        //----
    }

    update(time: number, delta: number) {


    }

    private initPlayer(name: string): PlayerInfo {
        return {
            name: name,
            turn: 0, bonusRoad: 0, turnComplete: false, selectA: 0, selectB: 0,
            groundA: undefined, groundB: undefined
        }
    }

    private onClick(hexagon: Hexagon) {

        if (!this.playerInfo.turnComplete) {
            const hexagonIndex = hexagon.index

            // Добавить проверку на совпадение по типу земель

            if (this.playerInfo.selectA == hexagonIndex) {
                this.playerInfo.selectA = null
                this.removeFromSelected(hexagonIndex)
            } else if (this.playerInfo.selectB == hexagonIndex) {
                this.playerInfo.selectB = null
                this.removeFromSelected(hexagonIndex)
            } else if (!this.playerInfo.selectA) {
                this.playerInfo.selectA = hexagonIndex
                this.addToSelected(hexagonIndex)
            } else if (!this.playerInfo.selectB) {
                const nIndex = this.hexagons.get(this.playerInfo.selectA)
                    .neighbours
                    .find((n) => n === hexagonIndex)
                if (nIndex >= 0) {
                    this.playerInfo.selectB = hexagonIndex
                    this.addToSelected(hexagonIndex)
                }

            }
        }
    }

    private addToSelected(hexagonIndex: number) {
        this.polygonGameObjects.get(hexagonIndex).setFillStyle(0x61b65f, 0.6)
    }

    private removeFromSelected(hexagonIndex: number) {
        this.polygonGameObjects.get(hexagonIndex).isFilled = false
    }

    private clearSelected() {
        this.removeFromSelected(this.playerInfo.selectA)
        this.removeFromSelected(this.playerInfo.selectB)
        this.playerInfo.selectA = null
        this.playerInfo.selectB = null
    }

    private makeRoad() {

        if (!this.playerInfo.turnComplete && this.playerInfo.selectA && this.playerInfo.selectB) {

            const pointA = this.hexagonCenter(this.hexagons.get(this.playerInfo.selectA))
            const pointB = this.hexagonCenter(this.hexagons.get(this.playerInfo.selectB))

            this.add.line(0, 0, pointA.x, pointA.y, pointB.x, pointB.y, 0xff0000).setOrigin(0, 0)
                .setLineWidth(3, 3)

            this.roads.set(this.playerInfo.selectA, this.playerInfo.selectB)
            this.clearSelected()

            //----
            this.playerInfo.turnComplete = true
            MapScene.emitter.emit(EventsEnum.MAKE_ROAD_AFTER)
        }

    }

    private startTurn() {

        this.playerInfo.groundA = this.deck.pop()
        this.playerInfo.groundB = this.deck.pop()

        if (this.playerInfo.groundA && this.playerInfo.groundB) {

            this.playerInfo.turn++
            this.playerInfo.turnComplete = false


            MapScene.emitter.emit(EventsEnum.START_TURN_AFTER)

        } else {
            // ЗАКОНЧИЛСЯ РАУНД!!!
            alert('END ROUND')
        }
    }

    private hexagonCenter(hexagon: Hexagon): Vector2Like {
        return {
            x: hexagon.points[0].x,
            y: hexagon.points[0].y + (hexagon.points[3].y - hexagon.points[0].y) / 2
        }
    }

    private drawHexagons(hexagon: Hexagon) {
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

        /*this.add.text(hexagon.points[0].x - 60, hexagon.points[0].y + 50, hexagon.ground)
            .setOrigin(0, 0)
            .setColor("#000000")
            .setFontSize(50)*/

        /*
        this.add.text(hexagon.points[0].x - 60, hexagon.points[0].y + 50, hexagon.artifact)
            .setOrigin(0, 0)
            .setColor("#000000")
            .setFontSize(50)
        */

    }


    private getConfigOrDefault(): MapConfig {

        const res = this.scene.settings.data as MapConfig;
        if (res.island) {
            return res
        } else {
            return {
                island: IslandEnum.PETIT
            }
        }
    }
}
