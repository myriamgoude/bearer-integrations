import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'

export default class FetchEntryIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    let url = '';
    const token = event.context.authAccess.accessToken;
    const body = event.params;

    if (body.type === 'contact') {
      url = `vid/${body.id}/profile`
    } else {
      url = `${body.id}`
    }

    const { data } = await Client(token, body.type).get(url);
    // Put your logic here
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  type: string;
  id: number;
}

export type ReturnedData = {
  // foo: string[]
}
