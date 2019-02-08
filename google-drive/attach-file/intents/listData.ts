import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import Client from './client';
import { folders as query } from './queries';
import { File } from "../views/types";

export default class ListDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    // Put your logic here
    query.q = `"${event.params.folderId}" in parents`;
    console.log(query);
    const { data }  = await Client(token).get('', { params: query });
    return { data: data.files }
  }
}

/**
 * Typing
 */
export type Params = {
  folderId: string;
}

export type ReturnedData = File[];
