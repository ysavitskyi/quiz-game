import { nhost } from '..'

interface IEvaluateResponse {
  score: number
  wrongAnswers: { answer_id: string; question_id: string }[]
}
export const evaluate = (
  solutions: {
    question_id: string
    answer_id: string
  }[]
) => {
  return nhost.functions.call<IEvaluateResponse>('evaluate', {
    solutions,
  })
}
