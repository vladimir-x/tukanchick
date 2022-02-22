
interface GameStateDto extends BaseDto {
    island: string
    roundCount: number
    gameStart: boolean
    gameEnd: boolean
    currentRound: number
    currentTurn: number
}
