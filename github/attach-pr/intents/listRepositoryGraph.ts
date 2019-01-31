import {
  TOAUTH2AuthContext,
  FetchData,
  TFetchPromise,
  TFetchActionEvent
} from "@bearer/intents";
import Client from './client'
import { repositories as query } from './queries'
import { Repo } from '../views/types'

export default class ListRepositoryGraphIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(
    event: TFetchActionEvent<Params, TOAUTH2AuthContext>
  ): TFetchPromise<ReturnedData> {    
    const token = event.context.authAccess.accessToken
    const { data } = await Client(token).post('graphql', { query })
    if(data.errors){
      const message = data.errors.map((e:{message: string}) => e.message).join(', ')
      return { error: message }
    }
    return {data: data.data.viewer.repositories.nodes}
  }
}
export type Params = {
  reference: any;
};
export type ReturnedData = Repo[];