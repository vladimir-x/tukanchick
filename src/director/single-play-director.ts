import {Director} from "./director";
import {EventBus} from "../scene/bus/EventBus";
import {EventsEnum} from "../enums/events.enum";
import {ScenesEnum} from "../enums/scenes.enum";
import {MapConfig} from "../entity/mapConfig";
import {PlayerInfo} from "../entity/playerInfo";
import {getRandom} from "../scene/map/map.util";
import Deck from "../scene/map/deck";
import {GroundsEnum} from "../enums/grounds.enum";
import {Hexagon} from "../entity/hexagon";
import {ArtifactsEnum} from "../enums/artifacts.enum";
import {TownLetters} from "../enums/townLetters";
import {ScoreZonesEnum} from "../enums/scoreZones.enum";

export class SinglePlayDirector extends Director {

    mapConfig: MapConfig

    playerInfo: PlayerInfo

    // колода кароточек с землями
    deck: Deck

    constructor(scene: Phaser.Scenes.ScenePlugin) {
        super(scene);
    }

    protected startGame(mapConfig: MapConfig) {

        this.mapConfig = mapConfig

        this.playerInfo = this.initPlayer("PLAYER_" + getRandom(10))

        this.scene.start(ScenesEnum.MAP, mapConfig)

    }

    protected initializeMapAfter() {
        EventBus.emit(EventsEnum.START_ROUND)
    }

    protected startRound() {
        this.deck = new Deck()
        this.playerInfo.round += 1
        this.playerInfo.turn = 0

        EventBus.emit(EventsEnum.START_ROUND_AFTER)
        EventBus.emit(EventsEnum.START_TURN)
    }


    protected startTurn() {

        this.playerInfo.groundA = this.deck.pop()
        this.playerInfo.groundB = this.deck.pop()

        this.playerInfo.turn++
        this.playerInfo.turnComplete = false
        this.playerInfo.readyTouch = true

        this.playerInfo.deckSize = this.deck.size()

        EventBus.emit(EventsEnum.START_TURN_AFTER)
    }


    protected endTurn() {
        const mapScene = this.scene.get(ScenesEnum.MAP)

        if (this.deck.size() > 1) {
            EventBus.emitDelayed(mapScene, 300, EventsEnum.START_TURN)
        } else {
            EventBus.emitDelayed(mapScene, 300, EventsEnum.END_ROUND)
        }
    }


    protected endRound() {

        this.calculateRoundScore()


        if (this.playerInfo.round < this.mapConfig.roundCount) {
            EventBus.emit(EventsEnum.END_ROUND_AFTER)
        } else {
            this.playerInfo.gameEnd = true

            this.calculateTotalScore()
            EventBus.emit(EventsEnum.END_GAME)
        }

        this.showScoreScreen()
    }

    private calculateTotalScore() {
        let total = 0

        //calc town
        this.playerInfo.townLetterConnected.forEach(letter => {
                total += this.playerInfo.townScores.get(letter as TownLetters)
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

    private calculateRoundScore() {

        let currentScore = 0

        //артефакты
        this.playerInfo.artifactConnected.forEach((count, artifact) => {

            if (this.isObject(artifact)) {

                const scores = this.playerInfo.artifactScores.get(artifact)
                for (let i = 0; i < count; ++i) {
                    currentScore += scores[i]
                }
            }
        })

        this.playerInfo.scores[this.playerInfo.round - 1] = currentScore
    }

    protected makeRoad(hexes: Hexagon[]) {

        if (this.checkSelectedHex(hexes)) {

            this.playerInfo.readyTouch = false

            EventBus.emit(EventsEnum.DRAW_ROAD, hexes)

            this.addToRoads(hexes[0].index, hexes[1].index)

            this.recalcRoadNet()
            this.checkTownConnection()
            //----
            if (!this.playerInfo.turnComplete) {
                this.playerInfo.turnComplete = true
            } else {
                this.playerInfo.bonusRoad -= 1
            }


            //---
            if (this.playerInfo.bonusRoad == 0) {
                EventBus.emit(EventsEnum.END_TURN)
            } else {
                this.playerInfo.readyTouch = true
            }

            EventBus.emit(EventsEnum.MAKE_ROAD_AFTER)
        }

    }


    protected closeGame() {
        this.scene.stop(ScenesEnum.SCORE)
        this.scene.stop(ScenesEnum.MAP_CONTROLS)
        this.scene.stop(ScenesEnum.MAP)

        this.scene.start(ScenesEnum.MAIN_MENU)
    }

    private showScoreScreen() {
        this.scene.launch(ScenesEnum.SCORE, this.playerInfo)
    }

    private addToRoads(a: number, b: number) {
        if (!this.playerInfo.roads.has(a)) {
            this.playerInfo.roads.set(a, new Set())
        }
        if (!this.playerInfo.roads.has(b)) {
            this.playerInfo.roads.set(b, new Set())
        }

        this.playerInfo.roads.get(a).add(b)
        this.playerInfo.roads.get(b).add(a)
    }

    private recalcRoadNet() {

        this.playerInfo.townNets.forEach((townHexId, netId) => {
            const h = this.playerInfo.hexagons.get(townHexId)

            if (netId == h.net) {
                // эта часть сети ещё ни к кому не присоеденена
                // можно запускать поиск

                const queue = []

                const visited = new Set<number>()
                queue.push(h)
                visited.add(h.index)

                while (queue.length > 0) {
                    let currHex = queue.pop()

                    this.playerInfo.roads.get(currHex.index)?.forEach((conIndex) => {
                            const conHex = this.playerInfo.hexagons.get(conIndex)

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
            hex.artifactConnected = true

            const prev = this.playerInfo.artifactConnected.get(hex.artifact) || 0
            this.playerInfo.artifactConnected.set(hex.artifact, prev + 1)

            if (this.playerInfo.artifactConnected.get(hex.artifact) == this.mapConfig.roundCount) {
                // выдать дополнительную дорогу
                this.playerInfo.bonusRoad += 1
                EventBus.emit(EventsEnum.BONUS_ROAD)
            }

            EventBus.emit(EventsEnum.CONNECT_ARTIFACT, hex)
        }
    }

    private checkTownConnection() {
        const townLetterConnected = this.playerInfo.townLetterConnected

        this.playerInfo.townByLetter.forEach((towns: Hexagon[], letter: TownLetters) => {
            if (!townLetterConnected.has(letter)) {
                if (towns[0].net && towns[0].net === towns[1].net) {
                    townLetterConnected.add(letter)
                    towns[0].artifactConnected = true
                    towns[1].artifactConnected = true

                    EventBus.emit(EventsEnum.CONNECT_TOWN, towns[0], towns[1])
                }
            }
        })
    }


    private isTown(artifact: ArtifactsEnum) {
        return artifact?.startsWith("TOWN_")
    }

    private isObject(artifact: ArtifactsEnum) {
        return !this.isTown(artifact)
    }


// --------------------------


    private initPlayer(name: string): PlayerInfo {
        return {
            deckSize: 0,
            gameEnd: false,
            readyTouch: false,
            name: name, turn: 0, round: 0, bonusRoad: 0, turnComplete: false, scores: [],
            artifactConnected: new Map(),
            townLetterConnected: new Set(),
            roads: new Map(),
            townNets: new Map(),
            hexagons: new Map(),
            townByLetter: new Map(),
            artifactScores: new Map(),
            townScores: new Map(),
        }
    }


    private checkSelectedHex(hexes: Hexagon[]): boolean {

        // есть ли выбор
        if (hexes.length < 2 || !hexes[0] || !hexes[1]) {
            return false
        }

        // подходятли по картам
        if (this.playerInfo.bonusRoad > 0) {
            // есть бонусная дорога, всегда подходят
        } else {
            const aa = this.sameGround(this.playerInfo.groundA, hexes[0].ground)
            const ab = this.sameGround(this.playerInfo.groundA, hexes[1].ground)
            const ba = this.sameGround(this.playerInfo.groundB, hexes[0].ground)
            const bb = this.sameGround(this.playerInfo.groundB, hexes[1].ground)

            if ((aa && bb) || (ab && ba)) {
                // есть подходящая пара
            } else {
                return false
            }
        }

        //проверить соседство
        const nIndex = hexes[0].neighbours.find((n) => n === hexes[1].index)
        return nIndex >= 0
    }

    private sameGround(a: GroundsEnum, b: GroundsEnum): boolean {
        return a === b || a === GroundsEnum.JOKER || b === GroundsEnum.JOKER
    }
}
