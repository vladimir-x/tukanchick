import * as Phaser from "phaser";

export function configCamera(scene: Phaser.Scene, maxWidth: number, maxHeight: number) {

    const camera = scene.cameras.main;

    camera.setBounds(0, 0, maxWidth, maxHeight)
    camera.zoom = 0.5

    let beforeX = 0
    let beforeY = 0

    let downX = 0
    let downY = 0

    let dragging = false

    scene.input.on("pointerdown", (pointer: any) => {

        dragging = true

        downX = pointer.x
        downY = pointer.y

        beforeX = camera.scrollX
        beforeY = camera.scrollY

    })
    scene.input.on("pointermove", (pointer: any) => {
        if (dragging) {
            if (pointer.isDown) {

                camera.scrollX = beforeX - pointer.x + downX
                camera.scrollY = beforeY - pointer.y + downY

            } else {
                dragging = false
            }
        }
    })
}
