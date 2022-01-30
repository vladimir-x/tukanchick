import Text = Phaser.GameObjects.Text;
import {Image} from "./image";

export class Button extends Image {

    textGO: Text

    constructor(scene: Phaser.Scene) {
        super(scene)
    }

    create(x: number, y: number, text?: string, onClick?: Function) {
        super.create(x, y)
        if (text) {
            this.textGO = this.scene.add.text(x, y, text).setOrigin(0, 0);
        }

        if (onClick && this.imageGO) {
            this.imageGO.setInteractive().on("pointerup", onClick)
        }
        return this
    }

    setOrigin(x?: number, y?: number) {
        super.setOrigin(x, y)
        this.textGO?.setOrigin(x, y)
        return this
    }

    setTextFont(size: number, color: string, fontStyle?: string) {
        this.textGO?.setFontSize(size)
        this.textGO?.setColor(color)
        this.textGO?.setFontStyle(fontStyle)
        return this
    }

    setText(text: string) {
        this.textGO?.setText(text)
        return this
    }

    setVisible(visible: boolean) {
        super.setVisible(visible)
        this.textGO?.setVisible(visible)
        return this
    }

    setAlphaText(alpha?: number) {
        this.textGO?.setAlpha(alpha)
        return this
    }

}
