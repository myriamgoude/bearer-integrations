//GQL type for pull request used in our intents
export type PullRequest = {
  id: string,
  title: string,
  url: string,
  state: string,
  number: number,
  comments: {
    totalCount: number
  }
  baseRefName: string,
  headRefName: string,
  repository: {
    id: string
  }
  author: {
    url: string,
    login: string,
  }
}

//GQL type for intent response
export type Repo = {
  id: string
  name: string
  nameWithOwner: string
  pullRequests: {
    totalCount: number,
  }
}

