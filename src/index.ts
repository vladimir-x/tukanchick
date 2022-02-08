import * as Phaser from "phaser";
import MapScene from "./scene/map/map.scene";
import Center = Phaser.Scale.Center;
import MainMenuScene from "./scene/main-menu/mainMenu.scene";
import ScoreScene from "./scene/map/score.scene";
import ControlsScene from "./scene/map/controls.scene";
import Client from "./multiplayer/client";
import LobbyScene from "./scene/lobby/lobby.scene";

const config = {
    type: Phaser.AUTO,
    parent: 'main-screen',
    fullscreenTarget: 'main-screen',
    scene: [MainMenuScene, MapScene, ControlsScene, ScoreScene, LobbyScene],
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

