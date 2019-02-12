import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client';
import { folders as query } from './queries';
import { File } from '../views/types'

export default class SearchDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const params = event.params;
    query.q = `name contains '${params.query}'`;
    console.log( query)
    const { data } = await Client(token).get('', {params: query});
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ');
      return { error: message }
    }
    // Put your logic here
    return { data: data.files }
  }
}

/**
 * Typing
 */
export type Params = {
  query: string
}

export type ReturnedData = File[];
