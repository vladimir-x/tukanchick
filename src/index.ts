import * as Phaser from "phaser";
import MapScene from "./scene/map/map.scene";
import Center = Phaser.Scale.Center;
import MainMenuScene from "./scene/main-menu/mainMenu.scene";
import ScoreScene from "./scene/map/score.scene";
import ControlsScene from "./scene/map/controls.scene";

const config = {
    type: Phaser.AUTO,
    parent: 'main-screen',
    fullscreenTarget: 'main-screen',
    scene: [MainMenuScene, MapScene, ControlsScene, ScoreScene],
    //scene: [MapScene , MainMenuScene, ControlsScene, ScoreScene ],
    scale: {
        autoCenter: Center.NO_CENTER,
        mode: Phaser.Scale.RESIZE,
    },
    input: {
        activePointers: 3,
    }
} as Phaser.Types.Core.GameConfig;

export const game = new Phaser.Game(config);

