import {
  Box,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'

import { INode } from '../../types'
import { useCallback } from 'react'

const QuestionNode: React.FC<
  INode & {
    value?: string
    disabled: boolean
    isInvalid: boolean
    onChange: (questionId: string, answerId: string) => void
  }
> = ({
  id,
  question,
  answers,
  value,
  disabled,
  isInvalid,
  onChange: outerOnChange,
}) => {
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      outerOnChange(id, value)
    },
    [id, outerOnChange]
  )

  return (
    <Box mb={1}>
      <FormControl disabled={disabled} error={isInvalid} fullWidth>
        <Accordion>
          <AccordionSummary>
            <FormLabel>{question}</FormLabel>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup name={id} value={value || null} onChange={onChange}>
              {answers.map((answer) => (
                <FormControlLabel
                  key={answer.id}
                  value={answer.id}
                  label={answer.answer}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
      </FormControl>
    </Box>
  )
}

export default QuestionNode
