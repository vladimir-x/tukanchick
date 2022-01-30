import * as Phaser from "phaser";
import MapScene from "./scene/map/map.scene";
import Center = Phaser.Scale.Center;
import MainMenuScene from "./scene/main-menu/mainMenu.scene";
import MapControlsScene from "./scene/map/mapControls.scene";
import ScoreScene from "./scene/map/score.scene";

const config = {
    type: Phaser.AUTO,
    parent: 'main-screen',
    fullscreenTarget: 'main-screen',
    scene: [MainMenuScene, MapScene, MapControlsScene, ScoreScene],
   // scene: [MapScene , MainMenuScene, MapControlsScene, ScoreScene ],
    scale: {
        autoCenter: Center.NO_CENTER,
        mode: Phaser.Scale.RESIZE,
    },
    input: {
        activePointers: 3,
    }
} as Phaser.Types.Core.GameConfig;

export const game = new Phaser.Game(config);

