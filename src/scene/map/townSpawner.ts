import {shuffleArray} from "./map.util";
import {TownLetters} from "../../enums/townLetters";

export default class TownSpawner {

    items: TownLetters[]

    constructor() {

        this.items = []

        for (let letter in TownLetters) {
            this.items.push(letter as TownLetters)
            this.items.push(letter as TownLetters)
        }

        shuffleArray(this.items)
    }


    public pop(): TownLetters {
        return this.items.pop()
    }



}
