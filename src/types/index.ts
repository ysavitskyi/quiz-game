export interface INode {
  id: string
  question: string
  answers: IAnswer[]
}

export interface IAnswer {
  id: string
  answer: string
}
