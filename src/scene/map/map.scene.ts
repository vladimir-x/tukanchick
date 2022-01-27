import * as Phaser from "phaser";
import {MapConfig} from "../../entity/mapConfig";
import {IslandEnum} from "../../enums/islands.enum";
import {Assets} from "../../assets";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Hexagon} from "../../entity/hexagon";
import {PlayerInfo} from "../../entity/playerInfo";
import {EventsEnum} from "../../enums/events.enum";
import Deck from "./deck";
import {GroundsEnum} from "../../enums/grounds.enum";
import {ArtifactsEnum} from "../../enums/artifacts.enum";
import Vector2Like = Phaser.Types.Math.Vector2Like;
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

export default class MapScene extends Phaser.Scene {

    mapConfig: MapConfig

    hexagons: Map<number, Hexagon>

    graphics: Graphics

    artifactMapZones: Map<ArtifactsEnum, ArtifactMapZone>

    polygonGeoms: Map<number, Phaser.Geom.Polygon>

    polygonGameObjects: Map<number, Phaser.GameObjects.Polygon>

    playerInfo: PlayerInfo

    // индексы соединенных гексов
    roads: Map<number, Set<number>>

    // колода кароточек с землями
    deck: Deck

    // гексы при соединении перетаскиванием
    hexA: Hexagon
    hexB: Hexagon

    // индекс сети, гекс-стартовый город
    roadNets: Map<number, Hexagon>

    artifactConnected: Map<ArtifactsEnum, number>

    townByLetter: Map<TownLetters, Hexagon[]>
    townLetterConnected: Set<TownLetters>


    //очки
    scoreZones: Button[]

    townZones: Map<TownLetters, TownMapZone>

    constructor() {
        super(ScenesEnum.MAP);

        EventBus.clear()

        this.scoreZones = []
        for (const z in ScoreZonesEnum) {
            this.scoreZones[z] = new Button(this)
        }


        for (let e in EventsEnum) {
            EventBus.on(e as EventsEnum, (event: any) => {
                console.log("EVENT >>>", e)
            })
        }

    }

    preload() {

        this.mapConfig = this.getConfigOrDefault()

        this.textures.remove("map")
        this.cache.json.remove("hexagons")
        this.cache.json.remove("mapzones")

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

        this.hexagons = new Map()

        this.roads = new Map()

        this.roadNets = new Map()

        this.artifactConnected = new Map()

        const mapInfo: MapInfo = this.cache.json.get("info")

        mapInfo.hexagons.forEach((h) => this.hexagons.set(h.index, h))

        this.artifactMapZones = new Map()

        mapInfo.artifacts.forEach((z) => this.artifactMapZones.set(z.artifact, z))

        this.graphics = this.add.graphics();

        this.polygonGeoms = new Map()

        this.polygonGameObjects = new Map()

        const townSpawner = new TownSpawner()

        this.townByLetter = new Map()
        for (let letter in TownLetters) {
            this.townByLetter.set(letter as TownLetters, [])
        }

        this.townLetterConnected = new Set()

        this.townZones = new Map()
        mapInfo.towns.forEach((z) => this.townZones.set(z.letter, z))


        //----

        const camera = new MapCamera(this, map.width, map.height)

        //----

        this.hexagons.forEach((h: Hexagon, key: number) => {

                if (this.isTown(h.artifact)) {
                    h.net = Number(h.artifact.substring(5))
                    h.townLetter = townSpawner.pop()
                    this.roadNets.set(h.net, h)

                    this.townByLetter.get(h.townLetter).push(h)
                }

                const polygonGeom = new Phaser.Geom.Polygon(h.points)
                const polygonGameObject = this.add.polygon(0, 0, h.points).setOrigin(0, 0)

                this.polygonGeoms.set(h.index, polygonGeom)
                this.polygonGameObjects.set(h.index, polygonGameObject)

                //this.drawHexagons(h)

                this.drawTownLetter(h)

                polygonGameObject
                    .setInteractive(polygonGeom,
                        (hitArea: Phaser.Geom.Polygon, x: number, y: number) => !camera.getDragging() && hitArea.contains(x, y))
                    .on('pointerdown', (pointer: any, localX: any, localY: any) => {
                        if (pointer.leftButtonDown()) {
                            this.hexA = h
                        }
                    })
                    .on('pointerup', (pointer: any, localX: any, localY: any) => {
                        if (pointer.leftButtonReleased()) {
                            this.hexB = h
                            EventBus.emit(EventsEnum.MAKE_ROAD)
                        }
                    })
                    .on('pointerover', (pointer: any, localX: any, localY: any) => {
                        if (camera.getDragging()) {
                            this.clearSelected()
                        } else {
                            this.addToSelected(h.index)
                        }
                    })
                    .on('pointerout', (pointer: any, localX: any, localY: any) => {
                        if (this.hexA != h && this.hexB != h) {
                            this.removeFromSelected(h.index)
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

        this.playerInfo = this.initPlayer("PLAYER")


        this.scene.launch(ScenesEnum.MAP_CONTROLS, this.playerInfo)

        EventBus.on(EventsEnum.START_TURN, this.startTurn, this)
        EventBus.on(EventsEnum.MAKE_ROAD, this.makeRoad, this)
        EventBus.on(EventsEnum.END_TURN, this.endTurn, this)

        EventBus.on(EventsEnum.START_ROUND, this.startRound, this)
        EventBus.on(EventsEnum.END_ROUND, this.endRound, this)

        EventBus.on(EventsEnum.START_GAME, this.startGame, this)
        EventBus.on(EventsEnum.END_GAME, this.endGame, this)


        EventBus.on(EventsEnum.CONNECT_ARTIFACT, this.onConnectArtifact, this)
        EventBus.on(EventsEnum.CONNECT_TOWN, this.onConnectTown, this)
        EventBus.on(EventsEnum.BONUS_ROAD, this.onBonusRoad, this)


        //----
        EventBus.emit(EventsEnum.START_GAME)
    }

    update(time: number, delta: number) {


    }

    private initPlayer(name: string): PlayerInfo {
        return {
            name: name, turn: 0, round: 0, bonusRoad: 0, turnComplete: false, scores: []
        }
    }

    private sameGround(a: GroundsEnum, b: GroundsEnum): boolean {
        return a === b || a === GroundsEnum.JOKER || b === GroundsEnum.JOKER
    }

    private addToSelected(hexagonIndex: number) {
        this.polygonGameObjects.get(hexagonIndex).setFillStyle(0x61b65f, 0.6)
    }

    private removeFromSelected(hexagonIndex: number) {
        const pgo = this.polygonGameObjects.get(hexagonIndex)
        if (pgo) {
            pgo.isFilled = false
        }
    }

    private clearSelected() {
        this.polygonGameObjects.forEach((p: any, index: number) => {
            this.removeFromSelected(index)
        })
        this.playerInfo.selectA = null
        this.playerInfo.selectB = null
        this.hexA = null
        this.hexB = null
    }

    private checkSelectedHex(): boolean {

        // есть ли выбор
        if (!this.hexA || !this.hexB) {
            return false
        }

        // подходятли по картам
        if (this.playerInfo.bonusRoad > 0) {
            // всегда подходят
        } else {
            const aa = this.sameGround(this.playerInfo.groundA, this.hexA.ground)
            const ab = this.sameGround(this.playerInfo.groundA, this.hexB.ground)
            const ba = this.sameGround(this.playerInfo.groundB, this.hexA.ground)
            const bb = this.sameGround(this.playerInfo.groundB, this.hexB.ground)

            if ((aa && bb) || (ab && ba)) {
                // есть подходящая пара
            } else {
                return false
            }
        }

        //проверить соседство
        const nIndex = this.hexA.neighbours.find((n) => n === this.hexB.index)
        return nIndex >= 0
    }

    private makeRoad() {

        if (this.checkSelectedHex()) {

            const pointA = this.hexagonCenter(this.hexA)
            const pointB = this.hexagonCenter(this.hexB)

            this.add.line(0, 0, pointA.x, pointA.y, pointB.x, pointB.y, 0xff0000).setOrigin(0, 0)
                .setLineWidth(3, 3)

            this.addToRoads(this.hexA.index, this.hexB.index)
            this.clearSelected()

            //----
            if (!this.playerInfo.turnComplete) {
                this.playerInfo.turnComplete = true
            } else {
                this.playerInfo.bonusRoad -= 1
            }

            this.recalcRoadNet()
            this.checkTownConnection()

            //---
            EventBus.emit(EventsEnum.MAKE_ROAD_AFTER)

            //---
            if (this.playerInfo.bonusRoad == 0) {
                EventBus.emit(EventsEnum.END_TURN)
            }
        } else {
            this.clearSelected()
        }
    }

    private addToRoads(a: number, b: number) {
        if (!this.roads.has(a)) {
            this.roads.set(a, new Set())
        }
        if (!this.roads.has(b)) {
            this.roads.set(b, new Set())
        }

        this.roads.get(a).add(b)
        this.roads.get(b).add(a)
    }

    private recalcRoadNet() {

        this.roadNets.forEach((h: Hexagon, k) => {
            if (k == h.net) {
                // эта часть сети ещё ни к кому не присоеденена
                // можно запускать поиск

                const queue = []

                const visited = new Set<number>()
                queue.push(h)
                visited.add(h.index)

                while (queue.length > 0) {
                    let currHex = queue.pop()

                    this.roads.get(currHex.index)?.forEach((conIndex) => {
                            const conHex = this.hexagons.get(conIndex)

                            if (!conHex.net || conHex.net > currHex.net) {

                                //регистрация коннекта артефакта
                                this.checkNewArtifact(conHex)

                                conHex.net = currHex.net
                                queue.push(conHex)
                            } else if (conHex.net === currHex.net && !visited.has(conIndex)) {
                                visited.add(conIndex)
                                queue.push(conHex)
                            }
                        }
                    )
                }
            }
        })
    }

    private checkNewArtifact(hex: Hexagon) {
        if (hex.artifact && !hex.artifactConnected && this.isObject(hex.artifact)) {
            const prev = this.artifactConnected.get(hex.artifact) || 0
            this.artifactConnected.set(hex.artifact, prev + 1)
            hex.artifactConnected = true

            EventBus.emit(EventsEnum.CONNECT_ARTIFACT, hex)
        }
    }

    private onConnectArtifact(hex: Hexagon) {

        this.drawArtifactFound(hex.artifact)
        if (this.artifactConnected.get(hex.artifact) == this.mapConfig.roundCount) {
            // выдать дополнительную дорогу
            EventBus.emit(EventsEnum.BONUS_ROAD)
        }
    }

    private onBonusRoad() {
        this.playerInfo.bonusRoad += 1
    }

    private drawArtifactFound(artifact: ArtifactsEnum) {

        this.graphics.lineStyle(4, 0x00ff00, 1);

        const conCount = this.artifactConnected.get(artifact)
        const points = this.artifactMapZones.get(artifact)?.points

        if (conCount > 0 && points && points.length > 0) {
            for (let i = 0; i < conCount; ++i) {
                this.graphics.strokeCircle(points[i].x, points[i].y, 45);
            }
        }

    }


    private onConnectTown(letter: TownLetters) {
        this.drawTownConnected(letter)
    }

    private checkTownConnection() {

        this.townByLetter.forEach((towns: Hexagon[], letter: TownLetters) => {
            if (!this.townLetterConnected.has(letter)) {
                if (towns[0].net && towns[0].net === towns[1].net) {
                    this.townLetterConnected.add(letter)

                    EventBus.emit(EventsEnum.CONNECT_TOWN, letter)
                }
            }
        })
    }

    private drawTownConnected(letter: TownLetters) {

        this.graphics.lineStyle(4, 0x00ff00, 1);

        const point = this.townZones.get(letter).point
        this.graphics.strokeCircle(point.x, point.y, 45);

        console.log("TownConnect", letter)
    }

    private startTurn() {

        this.playerInfo.groundA = this.deck.pop()
        this.playerInfo.groundB = this.deck.pop()

        this.playerInfo.turn++
        this.playerInfo.turnComplete = false

        EventBus.emit(EventsEnum.START_TURN_AFTER)
    }

    private endTurn() {
        if (this.deck.size() > 1) {
            EventBus.emitDelayed(this, 300, EventsEnum.START_TURN)
        } else {
            EventBus.emitDelayed(this, 300, EventsEnum.END_ROUND)
        }
    }

    private endRound() {

        this.calculateRoundScore()

        this.drawScore()

        alert('END ROUND !!!')

        EventBus.emit(EventsEnum.END_ROUND_AFTER)

        if (this.playerInfo.round < this.mapConfig.roundCount) {
            EventBus.emit(EventsEnum.START_ROUND)
        } else {


            EventBus.emit(EventsEnum.END_GAME)
        }
    }

    private drawScore() {

        for (const z in ScoreZonesEnum) {
            if (this.playerInfo.scores[z]) {
                this.scoreZones[z].setText(this.playerInfo.scores[z].toString())
            }
        }
    }

    private calculateRoundScore() {

        let currentScore = 0

        //артефакты
        this.artifactConnected.forEach((count, artifact) => {

            if (this.isObject(artifact)) {

                const scores = this.artifactMapZones.get(artifact).score
                for (let i = 0; i < count; ++i) {
                    currentScore += scores[i]
                }
            }
        })

        this.playerInfo.scores[this.playerInfo.round - 1] = currentScore
    }

    private calculateTotalScore() {
        let total = 0

        //calc town
        this.townLetterConnected.forEach(letter => {
                total += this.townZones.get(letter as TownLetters).score
            }
        )
        this.playerInfo.scores[ScoreZonesEnum.TOWN] = total

        // todo: calc bonus

        // calc round sum
        total += this.playerInfo.scores[ScoreZonesEnum.ROUND0]
        total += this.playerInfo.scores[ScoreZonesEnum.ROUND1]
        total += this.playerInfo.scores[ScoreZonesEnum.ROUND2] || 0


        this.playerInfo.scores[ScoreZonesEnum.TOTAL] = total
    }

    private startRound() {
        this.deck = new Deck()
        this.playerInfo.round += 1
        this.playerInfo.turn = 0

        EventBus.emit(EventsEnum.START_ROUND_AFTER)
        EventBus.emit(EventsEnum.START_TURN)
    }


    private startGame() {
        EventBus.emit(EventsEnum.START_ROUND)
    }

    private endGame() {

        this.calculateTotalScore()
        this.drawScore()

        alert('END GAME !!!')
    }

    private hexagonCenter(hexagon: Hexagon): Vector2Like {
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
        if (res.island) {
            return res
        } else {
            return {
                island: IslandEnum.PETIT,
                roundCount: 2
            }
        }
    }
}
