interface IGameBoard {
  players: { name: string; score: number | null }[]
  addPlayer: () => void
}
const GameBoard: React.FC<IGameBoard> = ({ players, addPlayer }) => {
  return (
    <div>
      <button
        onClick={addPlayer}
        disabled={players[0] && players[players.length - 1].score === null}
      >
        Add new player
      </button>
      <br />
      <br />
      <table border={1}>
        <thead style={{ background: 'lightgrey' }}>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.name}>
              <th>{player.name}</th>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GameBoard
