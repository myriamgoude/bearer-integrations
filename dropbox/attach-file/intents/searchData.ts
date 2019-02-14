import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client';
import { File } from '../views/types'

export default class SearchDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const params = event.params;
    const { data } = await Client(token).post('/files/search', {path: '', query: params.query, mode: 'filename'});
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ');
      return { error: message }
    }
    console.log(data);
    // Put your logic here
    return { data: data.matches.map(item => item.metadata) }
  }
}

/**
 * Typing
 */
export type Params = {
  query: string
}

export type ReturnedData = any[];
