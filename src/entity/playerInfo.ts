import {GroundsEnum} from "../enums/grounds.enum";
import {ArtifactsEnum} from "../enums/artifacts.enum";
import {TownLetters} from "../enums/townLetters";
import {Hexagon} from "./hexagon";

export interface PlayerInfo {

    name: string

    turn: number

    deckSize: number

    round: number

    turnComplete: boolean

    // выпавшие земли
    groundA?: GroundsEnum
    groundB?: GroundsEnum

    bonusRoad: number

    /**
     * Заработанные очки по всем категориям
     */
    scores: number[]

    // признак, что пользователь может делать соединение (не потратил ход)
    readyTouch: boolean

    gameEnd: boolean;

    // соединённые артефакты:  ТипАртефакта-Количество соединенных
    artifactConnected: Map<ArtifactsEnum, number>

    // соединенные города
    townLetterConnected: Set<TownLetters>

    // индексы соединенных гексов
    roads: Map<number, Set<number>>

    // сети
    //    индекс сети   | индекс: гекс-стартовый город
    townNets: Map<number, number>

    // гексы со всем их свойтсвами
    hexagons: Map<number, Hexagon>


    townByLetter: Map<TownLetters, Hexagon[]>

    /**
     * очки за артефакты(сколько начислять)
     *
     * тип_артефакта | количество соединенных | сколько очков
     */
    artifactScores: Map<ArtifactsEnum, number[]>

    /**
     * очки за города (сколько начислять)
     *
     * Буква Города | сколько очков
     */
    townScores: Map<TownLetters, number>
}
