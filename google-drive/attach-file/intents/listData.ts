import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import Client from './client';
import { folders as query } from './queries';
import { File } from "../views/types";

export default class ListDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    // Put your logic here
    if (event.params.folderId) {
      query.q = `"${event.params.folderId}" in parents`;
    }
    const { data }  = await Client(token).get('', { params: query });
    const type = 'application/vnd.google-apps.folder';
    data.files.sort((x,y) => { return x.mimeType == type ? -1 : y.mimeType == type ? 1 : 0; });
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ');
      return { error: message }
    }
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
