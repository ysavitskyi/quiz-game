import { useCallback, useState } from 'react'

import { INode } from '../../types'

const QuestionNode: React.FC<
  INode & { disabled: boolean; isInvalid: boolean; currentAnswer?: string }
> = ({ id, question, answers, disabled, isInvalid, currentAnswer }) => {
  const [visible, setVisible] = useState(false)
  const toggleFold = useCallback(() => {
    setVisible((visible) => !visible)
  }, [])

  return (
    <fieldset disabled={disabled}>
      <legend
        onClick={toggleFold}
        style={{
          cursor: 'pointer',
        }}
      >
        {question}
      </legend>
      <div
        style={{
          ...(!visible && {
            position: 'absolute',
            visibility: 'hidden',
            zIndex: -1,
          }),
        }}
      >
        {answers.map((answer) => (
          <label
            key={answer.id}
            style={{
              color: currentAnswer === answer.id && isInvalid ? 'red' : '',
            }}
          >
            <input type="radio" name={id} value={answer.id} />
            {answer.answer}
            <br />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default QuestionNode
