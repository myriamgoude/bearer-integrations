import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from "./client"

export default class UpdateEntryIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    let promise;
    const token = event.context.authAccess.accessToken;
    const body = event.params;

    if (JSON.parse(body.data).type === 'contact') {
      promise = await Client(token, JSON.parse(body.data).type).post(`vid/${body.id}/profile`, JSON.parse(body.data));
    } else {
      promise = await Client(token, JSON.parse(body.data).type).put(body.id, JSON.parse(body.data));
    }

    const { data } = promise
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  id: string
  data: any
}

export type ReturnedData = {
  // foo: string[]
}
