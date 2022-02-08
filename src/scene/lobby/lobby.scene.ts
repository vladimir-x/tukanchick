import * as Phaser from "phaser";
import {ScenesEnum} from "../../enums/scenes.enum";
import {Button} from "../../controls/button";
import {Assets} from "../../assets";
import {client} from "../../index";
import {LobbyConfig} from "../../entity/lobbyConfig";
import {Input} from "../../controls/input";
import {Message} from "../../multiplayer/message";
import {CommandsEnum} from "../../multiplayer/commands.enum";

export default class LobbyScene extends Phaser.Scene {

    config: LobbyConfig

    nicknameTextBox: Input
    commonCaptionText: Button


    createLobbyButton: Button
    joinLobbyButton: Button

    createdLobbyIdText: Button
    joinLobbyCaptionText: Button
    joinLobbyIdTextBox: Input

    exitButton: Button

    constructor() {
        super(ScenesEnum.LOBBY)

        this.nicknameTextBox = new Input(this)
        this.commonCaptionText = new Button(this)


        this.createLobbyButton = new Button(this)
        this.joinLobbyButton = new Button(this)

        this.createdLobbyIdText = new Button(this)
        this.joinLobbyCaptionText = new Button(this)
        this.joinLobbyIdTextBox = new Input(this)


        this.exitButton = new Button(this)
    }

    preload() {

        this.config = this.scene.settings.data as LobbyConfig;

        this.createLobbyButton.preload(Assets.SAND_1)
        this.joinLobbyButton.preload(Assets.SAND_1)

        this.exitButton.preload(Assets.SAND_1)

    }

    create() {

        const centerX = this.config.parentWidth / 2
        const leftX = 100
        const topY = 100

        const width = this.config.parentWidth - leftX * 2;
        const height = this.config.parentHeight - topY * 2;

        const botY = topY + height


        this.add.rectangle(this.config.parentWidth / 2, this.config.parentHeight / 2, width, height, 0x000000, 0.9).setOrigin(0.5, 0.5)

        let buttonSpace = 10
        let buttonWidth = width / 2 - buttonSpace * 2
        let buttonHeight = 50

        let leftColumnCenterX = leftX + buttonSpace + buttonWidth / 2
        let rightColumnCenterX = centerX + buttonSpace + buttonWidth / 2

        // nickname
        let nicknamePostY = topY + buttonSpace + buttonHeight / 2


        this.add.text(leftColumnCenterX, nicknamePostY, "Nickname:").setFontSize(30).setFontStyle('bold').setOrigin(0.5)

        this.nicknameTextBox.create(rightColumnCenterX, nicknamePostY, buttonWidth, buttonHeight, 'white', 'gray').setOrigin(0.5)
        this.nicknameTextBox.setText(localStorage.getItem('user_nick_name'))

        this.nicknameTextBox.onChange = (newNick: string) => {
            localStorage.setItem('user_nick_name', newNick)
        }


        // common caption
        let commonCaptionPosY = nicknamePostY + buttonHeight + buttonSpace + buttonSpace

        this.commonCaptionText.create(centerX, commonCaptionPosY, "CREATE LOBBY OR PUT LOBBY ID TO JOIN").setTextFont(30, 'white', 'bold').setOrigin(0.5)


        // buttons create/join
        let buttonCreateOrJoinPosY = commonCaptionPosY + buttonHeight + buttonSpace + buttonSpace

        this.createLobbyButton.create(leftColumnCenterX, buttonCreateOrJoinPosY,
            "CREATE LOBBY", () => this.createLobby()
        ).setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5)
            .setTextFont(30, "black", "bold")


        this.joinLobbyButton.create(rightColumnCenterX, buttonCreateOrJoinPosY,
            "JOIN LOBBY", () => this.joinLobby()
        ).setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5, 0.5)
            .setTextFont(30, "black", "bold")


        // text for created or joined lobby id
        let textLobbyIdPosY = buttonCreateOrJoinPosY + buttonHeight + buttonSpace

        this.createdLobbyIdText.create(centerX, textLobbyIdPosY, "__").setTextFont(30, 'white', 'bold').setOrigin(0.5)
            .setVisible(false)

        this.joinLobbyCaptionText.create(leftColumnCenterX, textLobbyIdPosY, "JOIN TO ").setTextFont(30, 'white', 'bold').setOrigin(0.5)
        this.joinLobbyIdTextBox.create(rightColumnCenterX, textLobbyIdPosY, buttonWidth, buttonHeight, 'white', 'SlateGray').setOrigin(0.5)

        let exitButtonPosY = botY - buttonHeight
        this.exitButton.create(centerX, exitButtonPosY,
            "EXIT", () => this.exit()
        ).setDisplaySize(buttonWidth, buttonHeight)
            .setOrigin(0.5)
            .setTextFont(30, "black", "bold")


        this.scene.pause(ScenesEnum.MAIN_MENU) // переделать на popup panel


        client.onReceive(CommandsEnum.CREATE_LOBBY_SUCCESS, (data: any) => this.createLobbySuccess(data))
        client.onReceive(CommandsEnum.JOIN_TO_LOBBY_SUCCESS, (data: any) => this.joinLobbySuccess(data))
        client.onReceive(CommandsEnum.JOIN_PARTY_MEMBER_SUCCESS, (data: any) => this.joinPartyMemberSuccess(data))
    }

    update() {
    }

    createLobby() {
        client.send({command: CommandsEnum.CREATE_LOBBY} as Message)
    }

    createLobbySuccess(data: any) {
        const lobbyId = data
        this.createdLobbyIdText.setText(`HOST LOBBY ID: ${lobbyId}`).setVisible(true)
        this.disableControlsAfterJoin()
    }

    joinLobby() {
        const lobbyId = this.joinLobbyIdTextBox.getText()
        client.send({command: CommandsEnum.JOIN_TO_LOBBY, data: lobbyId} as Message)
    }

    joinLobbySuccess(data: any) {
        const lobbyId = data
        this.createdLobbyIdText.setText(`JOIN SUCCESS: ${lobbyId}`).setVisible(true)
        this.disableControlsAfterJoin()
    }

    joinPartyMemberSuccess(data: any) {
        alert('new member income !')
    }

    disableControlsAfterJoin(){
        this.createLobbyButton.setDisable(true)
        this.joinLobbyButton.setDisable(true)
        this.joinLobbyCaptionText.setVisible(false)
        this.joinLobbyIdTextBox.setVisible(false)
    }

    exit() {
        client.send({command: CommandsEnum.CLOSE_LOBBY} as Message)
        this.scene.stop(ScenesEnum.LOBBY)
        this.scene.resume(ScenesEnum.MAIN_MENU)
    }
}
