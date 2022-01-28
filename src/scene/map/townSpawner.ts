import {getRandom, shuffleArray} from "./map.util";
import {TownLetters} from "../../enums/townLetters";

export default class TownSpawner {

    rolls: string[] = [
        'ADCBDACEBE',
        'DCEADCBAEB',
        'ECAEBDABDC',
        'BDCAEBEDCA',
        'DBACECDAEB',
        'BACBDCEAED',
        'EADBCEBDAC',
        'ACBDCDEBAE',
        'DADBAECECB',
        'CAECBADEBD',
        'EBDBACAECD',
        'CEBAEDCDAB',
        'BEDCBADECA',
    ]

    items: TownLetters[]

    constructor() {


        this.items = []

        const roll = this.rolls[getRandom(this.rolls.length)]

        for (let i = 0; i < roll.length; ++i) {
            this.items.push(roll.charAt(i) as TownLetters)
        }

        /*
        for (let letter in TownLetters) {
            this.items.push(letter as TownLetters)
            this.items.push(letter as TownLetters)
        }

        shuffleArray(this.items)
        */
    }

    public getByNumber(n: number): TownLetters {
        return this.items[n - 1];
    }
}
