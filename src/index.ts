import * as Phaser from "phaser";
import MainMenuScene from "./scene/main-menu.scene";
import MapScene from "./scene/map.scene";
import Center = Phaser.Scale.Center;

const config = {
    type: Phaser.AUTO,
    parent: 'main-screen',
    fullscreenTarget: 'main-screen',
    scene: [MainMenuScene, MapScene],
  //  scene: [MapScene , MainMenuScene, ],
    scale: {
        autoCenter: Center.NO_CENTER,
        mode: Phaser.Scale.RESIZE,
    }
} as Phaser.Types.Core.GameConfig;

export const game = new Phaser.Game(config);

