export class Image {

    textureAtlas: string

    imageGO: Phaser.GameObjects.Image

    constructor(private scene: Phaser.Scene) {

    }

    preload(textureAtlasImagePath: string, textureAtlasJsonPath: string) {
        this.textureAtlas = textureAtlasImagePath

        this.scene.load.atlas(textureAtlasImagePath, textureAtlasImagePath, textureAtlasJsonPath);
    }

    create(x: number, y: number, firstFrame: string = '') {

        this.imageGO = this.scene.add.image(x, y, this.textureAtlas, firstFrame).setOrigin(0, 0);

        return this
    }

    setDisplaySize(width: number, height: number) {
        this.imageGO.setDisplaySize(width, height)
        return this
    }

    changeFrame(frameName: string) {
        this.imageGO.setFrame(frameName)
        return this
    }

}
