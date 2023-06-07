import { gql, useQuery } from '@apollo/client'

import { INode } from '../../types'

const QuestionsAggregateQuery = gql`
  query QuestionsAggregateQuery {
    questions_aggregate {
      nodes {
        question
        id
        answers {
          answer
          id
        }
      }
    }
  }
`

interface IQuestionsAggregate {
  questions_aggregate: {
    nodes: INode[]
  }
}

export const useQuestionsAggregate = () => {
  const response = useQuery<IQuestionsAggregate>(QuestionsAggregateQuery)

  return response
}
