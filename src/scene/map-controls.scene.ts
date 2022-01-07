import * as Phaser from "phaser";
import {ScenesEnum} from "../enums/scenes.enum";
import {Button} from "../controls/button";
import MapScene from "./map.scene";
import {EventsEnum} from "../enums/events.enum";
import {PlayerInfo} from "../entity/playerInfo";

export default class MapControlsScene extends Phaser.Scene {

    playerInfo: PlayerInfo

    makeRoadButton: Button
    nextRoundButtonButton: Button

    roadCount: Button

    constructor() {
        super(ScenesEnum.MAP_CONTROLS)

        this.makeRoadButton = new Button(this)
        this.nextRoundButtonButton = new Button(this)
        this.roadCount = new Button(this)

    }

    preload() {
        this.makeRoadButton.preload('make-road-button')
        this.nextRoundButtonButton.preload('next-round-button')
        this.roadCount.preload('road-count-label')

        this.playerInfo = this.scene.settings.data as PlayerInfo
    }

    create() {

        // const {width, height} = this.scale

        this.makeRoadButton.create(100, 100, "MAKE-ROAD",
            () => MapScene.emitter.emit(EventsEnum.MAKE_ROAD)
        ).setDisplaySize(150, 50).textGO.setFontSize(20)

        this.makeRoadButton.create(300, 100, "NEXT-ROUND",
            () => MapScene.emitter.emit(EventsEnum.START_ROUND)
        ).setDisplaySize(150, 50).textGO.setFontSize(20)


        this.roadCount.create(460, 100, "ROADS").setDisplaySize(50, 50).textGO.setFontSize(50)

        MapScene.emitter.on(EventsEnum.START_ROUND_AFTER, this.updateRoadCounter, this)
        MapScene.emitter.on(EventsEnum.MAKE_ROAD_AFTER, this.updateRoadCounter, this)

        MapScene.emitter.emit(EventsEnum.START_ROUND)
    }

    private updateRoadCounter() {
        const roadsForCurrentRoundCount = (this.playerInfo.roundComplete ? 0 : 1) + this.playerInfo.bonusRoad
        this.roadCount.textGO.text = roadsForCurrentRoundCount.toString()
    }


}
