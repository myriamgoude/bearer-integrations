const pullRequestNodeSchema = `{
  id
  number
  title
  url
  state
  comments(first: 1) {
    totalCount
  }
  baseRefName
  headRefName
  author {
    url
    login
  }
  repository{
    id
  }
}`

export const repositories = `{
  viewer {
    repositories(first: 50,affiliations: [COLLABORATOR,OWNER, ORGANIZATION_MEMBER], ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], orderBy: {field: PUSHED_AT, direction: DESC},){
      nodes {
        id
        name
        nameWithOwner
        pullRequests(first: 1, states: OPEN) {
          totalCount,
        }
      }
    }
  }
}`

export const pullRequestsForNodes = (nodeIDs: string[]) => {
  const formatted = nodeIDs.map((n) => `"${n}"`).join(',')
  return `
    {
      nodes(ids: [${formatted}]) {
        ...on PullRequest ${pullRequestNodeSchema}
      }
    }
  `
}

export const latestPullRequestForRepoNode = (nodeId: string) => {
  return `
  {
    node(id: "${nodeId}") {
      ...on Repository{
        pullRequests(first: 10 orderBy: { field: UPDATED_AT direction: DESC}){
          nodes ${pullRequestNodeSchema}
        } 
      }
    }
  }
`
}

export const searchForPullRequests = (repo: string, query:string) => {
  return `
  {
    search(query: "repo:${repo} type:pr ${query}" type: ISSUE first:10){
      nodes {
        ...on PullRequest ${pullRequestNodeSchema}
      }
    }
  }
  `
}