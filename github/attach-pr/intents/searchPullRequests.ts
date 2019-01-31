import { TOAUTH2AuthContext, FetchData, TFetchPromise, TFetchActionEvent } from '@bearer/intents'
import Client from './client'
import { latestPullRequestForRepoNode, searchForPullRequests } from './queries'
import { PullRequest } from '../views/types'

export default class SearchPullRequestsIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const params = event.params
    let query = isSearch(params)
      ? searchForPullRequests(params.name, params.query)
      : latestPullRequestForRepoNode(params.id)
    const token = event.context.authAccess.accessToken

    const { data } = await Client(token).post('graphql', { query })
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ')
      return { error: message }
    }
    if (data.data.search) {
      return { data: data.data.search.nodes }
    }
    return { data: data.data.node.pullRequests.nodes }
  }
}

function isSearch(params: ParamsSearch | ParamsId): params is ParamsSearch {
  return (<ParamsId>params).id === undefined
}

type ParamsId = {
  id: string
}

type ParamsSearch = {
  name: string
  query: string
}
export type ReturnedData = PullRequest[]
export type Params = ParamsId | ParamsSearch
