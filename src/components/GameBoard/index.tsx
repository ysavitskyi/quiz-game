import {
  Box,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import React, { useCallback } from 'react'
interface IGameBoard {
  players: { name: string; score: number | null }[]
  addPlayer: () => void
  removePlayer: (name: string) => void
}
const GameBoard: React.FC<IGameBoard> = ({
  players,
  addPlayer,
  removePlayer,
}) => {
  const onRemovePlayer = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      removePlayer(
        (event.target as HTMLButtonElement).parentElement?.dataset
          .value as string
      )
    },
    [removePlayer]
  )

  return (
    <Box>
      <Button
        variant="contained"
        size="small"
        onClick={addPlayer}
        disabled={players[0] && players[players.length - 1].score === null}
      >
        Add new player
      </Button>
      <br />
      <br />
      <Table size="small">
        <TableHead style={{ background: 'lightgrey' }}>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Score</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.name}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.score}</TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  data-value={player.name}
                  onClick={onRemovePlayer}
                  title="Remove Player"
                >
                  <Box width="1em" height="1em" lineHeight={1}>
                    &#10006;
                  </Box>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default GameBoard
