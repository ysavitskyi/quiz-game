import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, List, ListItem, Typography, Button, Drawer } from '@mui/material'

import { evaluate } from '../../services'

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

  const removePlayer = useCallback((name: string) => {
    setPlayers((players) => {
      const newPlayers = players.filter((player) => player.name !== name)
      localStorage.setItem('players', JSON.stringify(newPlayers))

      return newPlayers
    })

    resetQuestionsRef.current()
  }, [])

  const setScore = useCallback((score: number) => {
    setPlayers((players) => {
      const newPlayers = [
        ...players.slice(0, -1),
        { ...players.slice(-1)[0], score },
      ]
      localStorage.setItem('players', JSON.stringify(newPlayers))

      return newPlayers
    })
  }, [])

  const onSubmit = useCallback(
    async (
      solutions: {
        question_id: string
        answer_id: string
      }[],
      setInvalidNodes: (ids: string[]) => void
    ) => {
      try {
        const { res } = await evaluate(solutions)

        if (res?.data) {
          const invalidNodes = res.data.wrongAnswers?.map(
            ({ question_id }) => question_id
          )
          setInvalidNodes(invalidNodes)
          setScore(res.data.score)
        }
      } catch (error) {
        // handle error
      }
    },
    [setScore]
  )

  useEffect(() => {
    const players = localStorage.getItem('players')
    if (players) {
      setPlayers(JSON.parse(players))
    }
  }, [])

  if (loading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box>Error in the query {error.message}</Box>
  }

  if (!data) {
    return <Box>No Data</Box>
  }

  return (
    <Box position="relative">
      <Rules />
      <GameBoard
        players={players}
        addPlayer={addPlayer}
        removePlayer={removePlayer}
      />
      <br />
      <br />
      <Questions
        nodes={data.questions_aggregate.nodes}
        disabled={!players[0] || players[players.length - 1].score !== null}
        resetRef={resetQuestionsRef}
        onSubmit={onSubmit}
      />
      <br />
    </Box>
  )
}

const Rules: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <Box position="absolute" top={0} right={0}>
      <Button onClick={() => setOpen(true)} size="small">
        Rules
      </Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box padding="1em">
          <Typography variant="h2">Rules</Typography>
          <List>
            <ListItem>- Create player and start quiz</ListItem>
            <ListItem>- When all questions answered press Submit</ListItem>
            <ListItem>
              - After validation is done there's possible to create a new Player
              and run the quiz anew
            </ListItem>
            <ListItem>
              * There is not possible to submit result or create a new Player
              until current session is done
            </ListItem>
            <ListItem>* Quiz is freezed until a Player is created</ListItem>
            <ListItem>* A Player name should be uniq</ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Game
