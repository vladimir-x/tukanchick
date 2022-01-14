import {shuffleArray} from "./map.util";

export default class TownSpawner {

    items: string[]

    constructor() {

        this.items = []

        this.items.push('A')
        this.items.push('A')
        this.items.push('B')
        this.items.push('B')
        this.items.push('C')
        this.items.push('C')
        this.items.push('D')
        this.items.push('D')
        this.items.push('E')
        this.items.push('E')

        shuffleArray(this.items)
    }


    public pop(): string {
        return this.items.pop()
    }



}
