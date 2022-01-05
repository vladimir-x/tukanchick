import * as Phaser from "phaser";
import MainMenuScene from "./scene/main-menu.scene";
import MapScene from "./scene/map.scene";

const config = {
    type: Phaser.AUTO,
    parent: 'main-screen',
    fullscreenTarget: 'main-screen',
    scene: [MainMenuScene, MapScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        zoom: 1,
    }
} as Phaser.Types.Core.GameConfig;

export const game = new Phaser.Game(config);

