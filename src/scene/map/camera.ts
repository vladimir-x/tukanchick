import * as Phaser from "phaser";
import Pointer = Phaser.Input.Pointer;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {EventsEnum} from "../../enums/events.enum";
import {EventBus} from "../bus/EventBus";

export default class MapCamera {

    downScale: Vector2Like[] = []
    currScale: Vector2Like[] = []

    downZoom: number;

    dragging: boolean = false;

    minZoom: number;
    maxZoom: number;

    constructor(private scene: Phaser.Scene, mapWidth: number, mapHeight: number) {

        const canvasWidth = scene.sys.game.canvas.width;
        const canvasHeight = scene.sys.game.canvas.height;

        this.minZoom = Math.min(canvasHeight / mapHeight, canvasWidth / mapWidth)
        this.maxZoom = Math.min(mapHeight / canvasHeight, mapWidth / canvasWidth)


        const camera = scene.cameras.main;

        camera.setBounds(0, 0, mapWidth, mapHeight)
        camera.zoom = 0.7

        let beforeX = 0
        let beforeY = 0

        let downX = 0
        let downY = 0


        let touchCount: number = 0;


        scene.input.on("pointerdown", (pointer: Pointer) => {

            touchCount++
            this.downZoom = camera.zoom
            this.downScale[pointer.id] = {x: pointer.x, y: pointer.y}

            if (pointer.middleButtonDown() || touchCount >= 2) {//|| pointer.id == 2
                this.dragging = true

                downX = pointer.x
                downY = pointer.y

                beforeX = camera.scrollX
                beforeY = camera.scrollY
            }

        })
        scene.input.on("pointermove", (pointer: any) => {
            if (this.dragging) {
                if (pointer.isDown) {

                    this.currScale[pointer.id] = {x: pointer.x, y: pointer.y}
                    if (pointer.id != 2) {
                        camera.scrollX = beforeX - pointer.x + downX
                        camera.scrollY = beforeY - pointer.y + downY
                    }
                    this.scaleByTouch()

                } else {
                    this.dragging = false
                    touchCount = 0
                }
            }
        })
        scene.input.on("pointerup", (pointer: Pointer) => {
            this.dragging = false
            touchCount = 0
        })
        scene.input.on('wheel', (pointer: Pointer, currentlyOver: any, dx: any, dy: any, dz: any, event: any) => {
            this.scaleByScroll(dy)
        });
    }


    scaleByTouch() {
        if (this.downScale[1]?.x && this.currScale[1]?.x&& this.currScale[2]?.x) {

            const a = this.calcGipp(this.currScale)
            const b = this.calcGipp(this.downScale)
            const diff = a - b


            this.setZoom(this.downZoom + diff * 0.001)
        }
    }

    scaleByScroll(dy: number) {
        const camera = this.scene.cameras.main;
        this.setZoom(camera.zoom - dy * 0.001)
    }

    setZoom(newZoom: number) {
        newZoom = newZoom > this.maxZoom ? this.maxZoom : newZoom
        newZoom = newZoom < this.minZoom ? this.minZoom : newZoom
        this.scene.cameras.main.zoom = newZoom
    }

    calcGipp(points: Vector2Like[]) {
        const a = points[1].x - points[2].x
        const b = points[1].y - points[2].y

        return Math.sqrt(a * a + b * b)
    }

    getDragging() {
        return this.dragging
    }

}
