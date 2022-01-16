import * as Phaser from "phaser";
import Pointer = Phaser.Input.Pointer;
import Vector2Like = Phaser.Types.Math.Vector2Like;

export default class MapCamera {

    downScale: Vector2Like[] = []
    currScale: Vector2Like[] = []

    downZoom: number;


    constructor(private scene: Phaser.Scene, private  maxWidth: number, private  maxHeight: number) {


        const camera = scene.cameras.main;

        camera.setBounds(0, 0, maxWidth, maxHeight)
        camera.zoom = 0.7

        let beforeX = 0
        let beforeY = 0

        let downX = 0
        let downY = 0

        let dragging = false

        let touchCount: number = 0;


        scene.input.on("pointerdown", (pointer: Pointer) => {

            touchCount++
            this.downZoom = camera.zoom
            this.downScale[pointer.id] = {x: pointer.x, y: pointer.y}

            if (pointer.middleButtonDown() || touchCount >= 2) {//|| pointer.id == 2
                dragging = true

                downX = pointer.x
                downY = pointer.y

                beforeX = camera.scrollX
                beforeY = camera.scrollY

            }

        })
        scene.input.on("pointermove", (pointer: any) => {


            if (dragging) {
                if (pointer.isDown) {

                    this.currScale[pointer.id] = {x: pointer.x, y: pointer.y}

                    if (pointer.id != 2) {
                        camera.scrollX = beforeX - pointer.x + downX
                        camera.scrollY = beforeY - pointer.y + downY
                    }

                    this.scaleByTouch()

                } else {
                    dragging = false
                    touchCount = 0
                }
            }
        })
        scene.input.on("pointerup", (pointer: Pointer) => {
            dragging = false
            touchCount = 0
        })
        scene.input.on('wheel', (pointer: Pointer, currentlyOver: any, dx: any, dy: any, dz: any, event: any) => {
            this.scaleByScroll(dy)
        });
    }


    scaleByTouch() {
        if (this.downScale[1]?.x && this.currScale[2]?.x) {

            const a = this.calcGipp(this.currScale)
            const b = this.calcGipp(this.downScale)
            const diff = a - b


            let newZoom = this.downZoom + diff * 0.001
            newZoom = newZoom > 3 ? 3 : newZoom
            newZoom = newZoom < 0.3 ? 0.3 : newZoom

            const camera = this.scene.cameras.main;
            camera.zoom = newZoom
        }
    }

    scaleByScroll(dy: number) {
        const camera = this.scene.cameras.main;
        let newZoom = camera.zoom - dy * 0.01

        newZoom = newZoom > 3 ? 3 : newZoom
        newZoom = newZoom < 0.3 ? 0.3 : newZoom
        camera.zoom = newZoom
    }

    calcGipp(points: Vector2Like[]) {
        const a = points[1].x - points[2].x
        const b = points[1].y - points[2].y

        return Math.sqrt(a * a + b * b)
    }

}
