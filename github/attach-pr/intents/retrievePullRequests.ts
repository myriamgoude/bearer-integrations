import {
  TOAUTH2AuthContext,
  FetchData,
  TFetchPromise,
  TFetchActionEvent
} from "@bearer/intents";
import Client from './client'
import { pullRequestsForNodes } from './queries'
import { PullRequest } from '../views/types'

export default class RetrievePullRequestsIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(
    event: TFetchActionEvent<Params, TOAUTH2AuthContext>
  ): TFetchPromise<ReturnedData> {    
    const token = event.context.authAccess.accessToken    
    const pulls = (event.context.reference) ? event.context.reference.pullRequests : []
    const query = pullRequestsForNodes(pulls)
    const { data } = await Client(token).post('graphql', { query })
    if(data.errors){
      const message = data.errors.map((e:{message: string}) => e.message).join(', ')
      return { error: message }
    }
    return {data: data.data.nodes}
  }
}
export type Params = {
  pullRequests: string[]
}
export type ReturnedData = PullRequest[];