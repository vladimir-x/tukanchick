import Vector2Like = Phaser.Types.Math.Vector2Like;


export interface Hexagon {
    index: number;

    points: Vector2Like[];

    neighbours: number[];

}