import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;

export class Button {

    textureKey: string

    imageGO: Image
    textGO: Text

    constructor(private scene: Phaser.Scene) {

    }

    preload(texture: string) {
        this.textureKey = texture

        this.scene.load.image(texture, this.textureKey);
    }

    create(x: number, y: number, text?: string, onClick?: Function) {

        this.imageGO = this.scene.add.image(x, y, this.textureKey).setOrigin(0, 0);
        if (text) {
            this.textGO = this.scene.add.text(x, y, text).setOrigin(0, 0);
        }

        if (onClick) {
            this.imageGO.setInteractive().on("pointerup", onClick)
        }
        return this
    }

    setDisplaySize(width: number, height: number) {
        this.imageGO.setDisplaySize(width, height)
        return this
    }

}
