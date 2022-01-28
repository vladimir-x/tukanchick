enum ImageType {TEXTURE, ATLAS}

export class Image {

    imageType: ImageType

    textureKey: string
    textureAtlas: string

    imageGO: Phaser.GameObjects.Image

    constructor(protected scene: Phaser.Scene) {

    }

    preload(texture: string) {
        this.imageType = ImageType.TEXTURE

        this.textureKey = texture
        this.scene.load.image(texture, this.textureKey);
    }

    preloadAtlas(textureAtlasImagePath: string, textureAtlasJsonPath: string) {
        this.imageType = ImageType.ATLAS

        this.textureAtlas = textureAtlasImagePath
        this.scene.load.atlas(textureAtlasImagePath, textureAtlasImagePath, textureAtlasJsonPath);
    }

    create(x: number, y: number) {
        return this.imageType === ImageType.ATLAS ?
            this.createAtlas(x, y) : this.createTexture(x, y)
    }

    createTexture(x: number, y: number) {
        this.imageGO = this.scene.add.image(x, y, this.textureKey).setOrigin(0, 0);
        return this
    }

    createAtlas(x: number, y: number, firstFrame: string = '') {
        this.imageGO = this.scene.add.image(x, y, this.textureAtlas, firstFrame).setOrigin(0, 0);
        return this
    }

    setOrigin(x?: number, y?: number) {
        this.imageGO?.setOrigin(x, y)
        return this
    }

    setDisplaySize(width: number, height: number) {
        this.imageGO.setDisplaySize(width, height)
        return this
    }

    changeFrame(frameName: string) {
        this.imageGO.setFrame(frameName).setAlpha(1)
        return this
    }

    setVisible(visible: boolean){
        this.imageGO?.setVisible(visible)
        return this
    }

    setAlphaImage(alpha?: number){
        this.imageGO?.setAlpha(alpha)
        return this
    }

}

