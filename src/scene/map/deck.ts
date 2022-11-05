import {GroundsEnum} from "../../enums/grounds.enum";
import {shuffleArray} from "./map.util";


export default class Deck {

    items: GroundsEnum[]

    constructor() {

        this.items = []

        for (let i = 0; i < 8; ++i) {
            this.items.push(GroundsEnum.SAND)
        }
        for (let i = 0; i < 7; ++i) {
            this.items.push(GroundsEnum.FOREST)
        }
        for (let i = 0; i < 6; ++i) {
            this.items.push(GroundsEnum.ROCK)
        }
        for (let i = 0; i < 4; ++i) {
            this.items.push(GroundsEnum.WATER)
        }
        for (let i = 0; i < 2; ++i) {
            this.items.push(GroundsEnum.JOKER)
        }

/*
        for (let i = 0; i < 20; ++i) {
            this.items.push(GroundsEnum.JOKER)
        }*/

        shuffleArray(this.items)
    }


    public pop(): GroundsEnum {
        return this.items.pop()
    }

    public size() {
        return this.items.length
    }

}
