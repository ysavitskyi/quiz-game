import { useCallback, useEffect, useRef, useState } from 'react'

import { evaluate } from '../../services'
import { INode } from '../../types'

import QuestionNode from './QuestionNode'

const Questions: React.FC<{
  nodes: INode[]
  disabled: boolean
  setScore: (score: number) => void
  resetRef: React.MutableRefObject<() => void>
}> = ({ nodes, disabled, setScore, resetRef }) => {
  const formRef = useRef<HTMLFormElement>(null)

  const [entries, setEntries] = useState<Record<string, string>>({})
  const [invalidNodes, setInvalidNodes] = useState<string[]>([])

  const onChange = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const entries = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >

    setEntries(entries)
  }, [])

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement)
      const entries = [...formData.entries()] as [string, string][]
      const solutions = entries.map(([question_id, answer_id]) => ({
        question_id,
        answer_id,
      }))

      try {
        const { res } = await evaluate(solutions)

        if (res?.data) {
          const invalidNodes = res.data.wrongAnswers?.map(
            ({ question_id }) => question_id
          )
          setInvalidNodes(invalidNodes)
          setScore(res.data.score)
        }
      } catch (error) {}
    },
    [setScore]
  )

  const onReset = useCallback(() => {
    setEntries({})
    setInvalidNodes([])

    formRef.current?.reset()
  }, [])

  useEffect(() => {
    resetRef.current = onReset // TODO: overwrite via proper approach
  }, [resetRef, onReset])

  return (
    <form ref={formRef} onSubmit={onSubmit} onChange={onChange}>
      {nodes.map((node) => (
        <QuestionNode
          key={node.id}
          isInvalid={invalidNodes.includes(node.id)}
          currentAnswer={entries[node.id]}
          disabled={disabled}
          {...node}
        />
      ))}
      <br />
      <button
        type="submit"
        disabled={disabled || Object.keys(entries).length !== nodes.length}
      >
        Submit
      </button>
    </form>
  )
}

export default Questions
