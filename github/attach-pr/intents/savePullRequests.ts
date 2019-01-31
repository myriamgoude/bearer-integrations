import { PullRequest } from '../views/types'
import {
  TOAUTH2AuthContext,
  SaveState,
  TSaveActionEvent,
  TSavePromise
} from "@bearer/intents";

export default class SavePullRequestsIntent extends SaveState
  implements SaveState<State, ReturnedData, any, TOAUTH2AuthContext> {
  async action(
    event: TSaveActionEvent<State, Params, TOAUTH2AuthContext>
  ): TSavePromise<State, ReturnedData> {
    const { pullRequests } = event.params
    return { 
      state: {
        pullRequests: pullRequests.map(pullRequest => pullRequest.id)
      },
      data: pullRequests 
    }
  }
}

/**
 * Typing
 */
export type Params = {
  pullRequests: PullRequest[]
}

export type State = {
  pullRequests: string[]
}

export type ReturnedData = PullRequest[];