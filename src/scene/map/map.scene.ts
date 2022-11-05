import * as Phaser from "phaser";
import {MapConfig} from "../../entity/mapConfig";
import {IslandEnum} from "../../enums/islands.enum";
import {Assets} from "../../assets";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Hexagon} from "../../entity/hexagon";
import {PlayerInfo} from "../../entity/playerInfo";
import {EventsEnum} from "../../enums/events.enum";
import {GroundsEnum} from "../../enums/grounds.enum";
import {ArtifactsEnum} from "../../enums/artifacts.enum";
import Graphics = Phaser.GameObjects.Graphics;
import {ArtifactMapZone} from "../../entity/artifactMapZone";
import {MapInfo} from "../../entity/mapInfo";
import {Button} from "../../controls/button";
import {ScoreZonesEnum} from "../../enums/scoreZones.enum";
import TownSpawner from "./townSpawner";
import {TownLetters} from "../../enums/townLetters";
import {TownMapZone} from "../../entity/townMapZone";
import MapCamera from "./camera";
import {EventBus} from "../bus/EventBus";
import {director} from "../../index";
import {SinglePlayDirector} from "../../director/single-play-director";
import {Point} from "../../entity/point";

export default class MapScene extends Phaser.Scene {

    mapConfig: MapConfig

    graphics: Graphics

    artifactMapZones: Map<ArtifactsEnum, ArtifactMapZone>

    polygonGeoms: Map<number, Phaser.Geom.Polygon>

    polygonGameObjects: Map<number, Phaser.GameObjects.Polygon>

    // гексы при соединении перетаскиванием
    hexA: Hexagon
    hexB: Hexagon

    //очки
    scoreZones: Button[]

    //города
    townZones: Map<TownLetters, TownMapZone>

    get playerInfo(): PlayerInfo {
        return (director as SinglePlayDirector).playerInfo
    }


    constructor() {
        super(ScenesEnum.MAP);

        this.scoreZones = []
        for (const z in ScoreZonesEnum) {
            this.scoreZones[z] = new Button(this)
        }

    }

    preload() {

        this.mapConfig = this.getConfigOrDefault()

        this.textures.remove("map")
        this.cache.json.remove("info")

        switch (this.mapConfig.island) {
            case IslandEnum.PETIT:
                this.load.image("map", Assets.MAP_ISLAND_PETIT);
                this.load.json("info", Assets.MAPINFO_ISLAND_PETIT)
                break;
            case IslandEnum.GRANDE:
                this.load.image("map", Assets.MAP_ISLAND_GRANDE);
                this.load.json("info", Assets.MAPINFO_ISLAND_GRANDE)
                break;

        }

    }

    create() {
        const map = this.add.image(0, 0, "map").setOrigin(0, 0)

        const mapInfo: MapInfo = this.cache.json.get("info")

        mapInfo.hexagons.forEach((h) => this.playerInfo.hexagons.set(h.index, h))

        this.artifactMapZones = new Map()

        mapInfo.artifacts.forEach((z) => {
            this.artifactMapZones.set(z.artifact, z)
            this.playerInfo.artifactScores.set(z.artifact, z.score)
        })

        this.graphics = this.add.graphics();

        this.polygonGeoms = new Map()

        this.polygonGameObjects = new Map()

        const townSpawner = new TownSpawner()

        for (let letter in TownLetters) {
            this.playerInfo.townByLetter.set(letter as TownLetters, [])
        }


        this.townZones = new Map()
        mapInfo.towns.forEach((z) => {
            this.townZones.set(z.letter, z)
            this.playerInfo.townScores.set(z.letter, z.score)
        })


        //----

        const camera = new MapCamera(this, map.width, map.height)

        //----

        this.playerInfo.hexagons.forEach((h: Hexagon, index: number) => {

                if (this.isTown(h.artifact)) {
                    const townNumber = Number(h.artifact.substring(5))
                    h.net = townNumber
                    h.townLetter = townSpawner.getByNumber(townNumber)
                    this.playerInfo.townNets.set(h.net, h.index)

                    this.playerInfo.townByLetter.get(h.townLetter).push(h)
                }

                const polygonGeom = new Phaser.Geom.Polygon(h.points)
                const polygonGameObject = this.add.polygon(0, 0, h.points).setOrigin(0, 0)

                this.polygonGeoms.set(h.index, polygonGeom)
                this.polygonGameObjects.set(h.index, polygonGameObject)

                //this.drawHexagons(h)

                this.drawTownLetter(h)

                polygonGameObject
                    .setInteractive(polygonGeom,
                        (hitArea: Phaser.Geom.Polygon, x: number, y: number) => this.playerInfo.readyTouch && !camera.getDragging() && hitArea.contains(x, y))
                    .on('pointerdown', (pointer: any, localX: any, localY: any) => {
                        if (camera.getDragging()) {
                            this.clearSelected()
                        } else if (pointer.leftButtonDown()) {
                            this.hexA = h
                        }
                    })
                    .on('pointerup', (pointer: any, localX: any, localY: any) => {
                        if (camera.getDragging()) {
                            this.clearSelected()
                        } else if (pointer.leftButtonReleased()) {
                            this.hexB = h
                            EventBus.emit(EventsEnum.MAKE_ROAD, this.hexA, this.hexB)
                            this.clearSelected()
                        }
                    })
                    .on('pointerover', (pointer: any, localX: any, localY: any) => {
                        if (camera.getDragging()) {
                            this.clearSelected()
                        } else {
                            this.addToSelected(h)
                        }
                    })
                    .on('pointerout', (pointer: any, localX: any, localY: any) => {
                        if (this.hexA != h && this.hexB != h) {
                            this.removeFromSelected(h)
                        }
                    })
            }
        )

        //----

        for (const z in ScoreZonesEnum) {
            if (mapInfo.scores[z]?.x) {
                this.scoreZones[z].create(mapInfo.scores[z].x, mapInfo.scores[z].y, "___").setTextFont(80, "black")
            }
        }


        //----


        this.scene.launch(ScenesEnum.MAP_CONTROLS, this.playerInfo)


        EventBus.on(EventsEnum.DRAW_ROAD, this.drawRoad, this)

        EventBus.on(EventsEnum.END_ROUND, this.drawScore, this)

        EventBus.on(EventsEnum.END_GAME, this.drawScore, this)


        EventBus.on(EventsEnum.CONNECT_ARTIFACT, this.onConnectArtifact, this)
        EventBus.on(EventsEnum.CONNECT_TOWN, this.onConnectTown, this)
        EventBus.on(EventsEnum.MARK_HEXAGON, this.markHexagon, this)


        //----
        EventBus.emit(EventsEnum.INITIALIZE_MAP_AFTER)
    }

    update(time: number, delta: number) {


    }

    private addToSelected(hex: Hexagon) {
        hex.isSelected = true
        this.markHexagon(hex)
    }

    private removeFromSelected(hex: Hexagon) {
        hex.isSelected = false
        this.markHexagon(hex)
    }

    private markHexagon(hex: Hexagon) {
        const pgo = this.polygonGameObjects.get(hex.index)

        if (pgo) {
            if (hex.isSelected) {
                pgo.setFillStyle(0x61b65f, 0.6)
            } else if (hex.artifactConnected) {
                pgo.setFillStyle(0xcccc00, 0.4)
            } else {
                pgo.isFilled = false
            }
        }
    }

    private clearSelected() {
        this.playerInfo.hexagons.forEach((hex, index) => {
            this.removeFromSelected(hex)
        })
        this.hexA = null
        this.hexB = null
    }

    private drawRoad(hexes: Hexagon[]) {

        const pointA = this.hexagonCenter(hexes[0])
        const pointB = this.hexagonCenter(hexes[1])

        this.add.line(0, 0, pointA.x, pointA.y, pointB.x, pointB.y, 0xff0000).setOrigin(0, 0)
            .setLineWidth(3, 3)

    }

    private onConnectArtifact(hex: Hexagon) {

        this.markHexagon(hex)
        this.drawArtifactFound(hex.artifact)

    }


    private drawArtifactFound(artifact: ArtifactsEnum) {

        const conCount = this.playerInfo.artifactConnected.get(artifact)
        const points = this.artifactMapZones.get(artifact)?.points

        if (conCount > 0 && points && points.length > 0) {
            this.graphics.lineStyle(4, 0x00ff00, 1);

            for (let i = 0; i < conCount; ++i) {
                this.graphics.strokeCircle(points[i].x, points[i].y, 45);
            }
        }

    }


    private onConnectTown(townHexes: Hexagon[]) {

        // подсветить гексы на карте
        this.markHexagon(townHexes[0])
        this.markHexagon(townHexes[1])

        // обвести на боковой панеле
        const letter = townHexes[0].townLetter

        const point = this.townZones.get(letter).point
        this.graphics.lineStyle(4, 0x00ff00, 1);
        this.graphics.strokeCircle(point.x, point.y, 45);
    }


    private drawScore() {

        // рисуем на боковой панельке подсчитанные очки
        for (const z in ScoreZonesEnum) {
            if (this.playerInfo.scores[z]) {
                this.scoreZones[z].setText(this.playerInfo.scores[z].toString())
            }
        }
    }

    private hexagonCenter(hexagon: Hexagon): Point {
        return {
            x: hexagon.points[0].x,
            y: hexagon.points[0].y + (hexagon.points[3].y - hexagon.points[0].y) / 2
        }
    }


    private drawTownLetter(hexagon: Hexagon) {
        if (hexagon.townLetter) {

            const x = hexagon.points[5].x + (hexagon.points[1].x - hexagon.points[5].x) / 3
            const y = hexagon.points[0].y + (hexagon.points[2].y - hexagon.points[0].y) / 3

            this.add.text(x, y, hexagon.townLetter)
                .setOrigin(0, 0)
                .setColor("#000000")
                .setFontStyle("bold")
                .setFontSize(100)
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

    private isTown(artifact: ArtifactsEnum) {
        return artifact?.startsWith("TOWN_")
    }

    private isObject(artifact: ArtifactsEnum) {
        return !this.isTown(artifact)
    }

    private getConfigOrDefault(): MapConfig {
        const res = this.scene.settings.data as MapConfig;
        return res.island ? res : {
            island: IslandEnum.PETIT,
            roundCount: 2
        }
    }
}
