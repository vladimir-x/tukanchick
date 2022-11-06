import * as Phaser from "phaser";
import {IslandEnum} from "../../enums/islands.enum";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import {Assets} from "../../assets";
import {Image} from "../../controls/image";
import {client, startSinglePlayer} from "../../index";
import {LobbyConfig} from "../../entity/lobbyConfig";

export default class MainMenuScene extends Phaser.Scene {

    background: Image

    petitButton: Button
    grandeButton: Button

    multiplayerButton: Button

    enableNet: boolean

    constructor() {
        super(ScenesEnum.MAIN_MENU)

        this.background = new Image(this).preloadExtern(Assets.MENU_LOGO)
        this.petitButton = new Button(this).preloadAtlasExtern(Assets.STAFF_IMAGE)
        this.grandeButton = new Button(this).preloadAtlasExtern(Assets.STAFF_IMAGE)

        this.multiplayerButton = new Button(this).preloadExtern(Assets.SAND_1)

        this.enableNet = true

    }

    preload() {

    }

    create() {

        this.background.create(0, 0)
        const {width, height} = this.background.imageGO

        let buttonWidth = 600 * 0.5
        let buttonHeight = 200 * 0.5
        let buttonSpace = 10

        // single

        let petitButtonHeght = height * 0.3
        this.petitButton.create(width * 0.5, petitButtonHeght,
            null,
            () => startSinglePlayer(this, IslandEnum.PETIT)
        ).changeFrame('ISLA_PETIT').setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5)

        let grandeButtonHeght = petitButtonHeght + buttonHeight + buttonSpace
        this.grandeButton.create(width * 0.5, grandeButtonHeght,
            null,
            () => startSinglePlayer(this, IslandEnum.GRANDE)
        ).changeFrame('ISLA_GRANDE').setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5)


        let multiplayerHeight = grandeButtonHeght + (buttonHeight + buttonSpace) * 2
        this.multiplayerButton.create(width * 0.5, multiplayerHeight,
            "MULTIPALYER",
            () => this.scene.launch(ScenesEnum.LOBBY, {parentWidth: width, parentHeight: height} as LobbyConfig)
        ).setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5)
            .setTextFont(30, "black", "bold")
            .setDisable(true)

        if (this.enableNet) {
            client
                .connect()
                .onOpen(() => {
                    this.multiplayerButton.setDisable(false)
                })
                .onClose(() => {
                    this.multiplayerButton.setDisable(true)
                })
        }


        this.add.text(0, 0, "ver " + "0.0.7").setOrigin(0).setFontSize(20).setFontStyle('bold').setColor('white')
    }

    update() {
    }
}
