import {GroundsEnum} from "../../enums/grounds.enum";


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
        this.shuffleArray(this.items)
    }


    public pop(): GroundsEnum {
        return this.items.pop()
    }

    private shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
