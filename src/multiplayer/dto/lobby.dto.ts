interface LobbyDto extends BaseDto {
    lobbyId?: string
    members?: MemberDto[]
    gameState?: GameStateDto
}
