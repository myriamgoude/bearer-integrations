import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import Client from './client';
import { folders as query } from './queries';
import { File } from "../views/types";

export default class ListDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const type = 'application/vnd.google-apps.folder';
    // Put your logic here
    const folderId = (event.params.folderId) ? event.params.folderId : 'root';
    query.q = `"${folderId}" in parents and mimeType = "${type}"`;

    const { data }  = await Client(token).get('', { params: query });
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
