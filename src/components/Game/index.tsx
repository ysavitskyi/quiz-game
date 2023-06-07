import { useCallback, useRef, useState } from 'react'

import GameBoard from '../GameBoard'
import Questions from '../Questions'

import { useQuestionsAggregate } from './gql'

const Game: React.FC = () => {
  const { loading, data, error } = useQuestionsAggregate()

  const [players, setPlayers] = useState<
    { name: string; score: number | null }[]
  >([])

  const resetQuestionsRef = useRef(() => {})

  const addPlayer = useCallback(() => {
    const name = prompt('Set new player name (uniq)')

    if (name) {
      setPlayers((players) => {
        return players.find((player) => player.name === name)
          ? players
          : [...players, { name, score: null }]
      })

      resetQuestionsRef.current()
    }
  }, [])

  const setScore = useCallback((score: number) => {
    setPlayers((players) => [
      ...players.slice(0, -1),
      { ...players.slice(-1)[0], score },
    ])
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error in the query {error.message}</div>
  }

  if (!data) {
    return <div>No Data</div>
  }

  return (
    <div>
      <GameBoard players={players} addPlayer={addPlayer} />
      <br />
      <Questions
        nodes={data.questions_aggregate.nodes}
        disabled={!players[0] || players[players.length - 1].score !== null}
        setScore={setScore}
        resetRef={resetQuestionsRef}
      />
      <h2>Rules</h2>
      <ul>
        <li>- Create player and start quiz</li>
        <li>- When all questions answered press Submit</li>
        <li>
          - After validation is done there's possible to create a new Player and
          run the quiz anew
        </li>
        <li>
          * There is not possible to submit result or create a new Player until
          current session is done
        </li>
        <li>* Quiz is freezed until a Player is created</li>
        <li>* A Player name should be uniq</li>
        <li>
          * The game record is alive only along current browser tab session
          (stored only in ongoing runtime)
        </li>
      </ul>
    </div>
  )
}

export default Game
