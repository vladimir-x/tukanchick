import * as Phaser from "phaser";
import MainMenuScene from "./scene/main-menu.scene";
import MapScene from "./scene/map.scene";
import Center = Phaser.Scale.Center;
import MapControlsScene from "./scene/map-controls.scene";

const config = {
    type: Phaser.AUTO,
    parent: 'main-screen',
    fullscreenTarget: 'main-screen',
    scene: [MainMenuScene, MapScene, MapControlsScene],
  // scene: [MapScene , MainMenuScene, MapControlsScene ],
    scale: {
        autoCenter: Center.NO_CENTER,
        mode: Phaser.Scale.RESIZE,
    }
} as Phaser.Types.Core.GameConfig;

export const game = new Phaser.Game(config);

