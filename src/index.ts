import * as Phaser from "phaser";
import MapScene from "./scene/map/map.scene";
import Center = Phaser.Scale.Center;
import MainMenuScene from "./scene/main-menu/mainMenu.scene";
import ScoreScene from "./scene/map/score.scene";
import ControlsScene from "./scene/map/controls.scene";
import Client from "./multiplayer/client";
import LobbyScene from "./scene/lobby/lobby.scene";
import {Director} from "./director/director";
import {IslandEnum} from "./enums/islands.enum";
import {SinglePlayDirector} from "./director/single-play-director";
import {MapConfig} from "./entity/mapConfig";
import {MultiPlayDirector} from "./director/multi-play-director";
import {EventBus} from "./scene/bus/EventBus";
import {EventsEnum} from "./enums/events.enum";
import LoadScene from "./scene/load/load.scene";

const config = {
    type: Phaser.AUTO,
    parent: 'main-screen',
    fullscreenTarget: 'main-screen',
    scene: [LoadScene, MainMenuScene, MapScene, ControlsScene, ScoreScene, LobbyScene],
    //scene: [MapScene , MainMenuScene, ControlsScene, ScoreScene, LobbyScene ],
    scale: {
        autoCenter: Center.NO_CENTER,
        mode: Phaser.Scale.RESIZE,
    },
    input: {
        activePointers: 3,
    },
    dom: {
        createContainer: true
    }

} as Phaser.Types.Core.GameConfig;

export const game = new Phaser.Game(config);

export const client = new Client()

export let director: Director = null

export function startSinglePlayer(scene: Phaser.Scene, island: IslandEnum) {

    director = new SinglePlayDirector(scene.scene)

    let mapConfig: MapConfig
    switch (island) {
        case IslandEnum.PETIT:
            mapConfig = {island: IslandEnum.PETIT, roundCount: 2} as MapConfig
            break;
        case IslandEnum.GRANDE:
            mapConfig = {island: IslandEnum.GRANDE, roundCount: 3} as MapConfig
            break;

    }
    EventBus.emit(EventsEnum.START_GAME, mapConfig)
}


export function startMultiPlayer(scene: Phaser.Scene) {

    director = new MultiPlayDirector(scene.scene)
}
