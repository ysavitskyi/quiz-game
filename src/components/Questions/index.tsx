import { useCallback, useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'

import { INode } from '../../types'

import QuestionNode from './QuestionNode'

const Questions: React.FC<{
  nodes: INode[]
  disabled: boolean
  resetRef: React.MutableRefObject<() => void>
  onSubmit: (
    solutions: {
      question_id: string
      answer_id: string
    }[],
    setInvalidNodes: (ids: string[]) => void
  ) => void
}> = ({ nodes, disabled, onSubmit: outerOnSubmit, resetRef }) => {
  const [entries, setEntries] = useState<Record<string, string>>({})
  const [invalidNodes, setInvalidNodes] = useState<string[]>([])

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      const entries = [...formData.entries()] as [string, string][]
      const solutions = entries.map(([question_id, answer_id]) => ({
        question_id,
        answer_id,
      }))

      outerOnSubmit(solutions, setInvalidNodes)
    },
    [outerOnSubmit]
  )

  const onReset = useCallback(() => {
    setEntries({})
    setInvalidNodes([])
  }, [])

  const onFieldChange = (questionId: string, answerId: string) => {
    setEntries((entries) => ({ ...entries, [questionId]: answerId }))
  }

  useEffect(() => {
    resetRef.current = onReset // TODO: overwrite via proper approach
  }, [resetRef, onReset])

  return (
    <Box onSubmit={onSubmit} onReset={onReset} component="form">
      {nodes.map((node) => (
        <QuestionNode
          key={node.id}
          isInvalid={invalidNodes.includes(node.id)}
          disabled={disabled}
          value={entries[node.id]}
          onChange={onFieldChange}
          {...node}
        />
      ))}
      <br />
      <Button
        type="submit"
        size="small"
        variant="contained"
        disabled={disabled || Object.keys(entries).length !== nodes.length}
      >
        Submit
      </Button>
      &nbsp;
      <Button
        type="reset"
        size="small"
        variant="contained"
        color="secondary"
        disabled={disabled || Object.keys(entries).length === 0}
      >
        Reset
      </Button>
    </Box>
  )
}

export default Questions
