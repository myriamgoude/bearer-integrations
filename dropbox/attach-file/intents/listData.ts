import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import Client from './client';
import { folders as query } from './queries';
import { File } from "../views/types";

export default class ListDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    let folderPath = event.params.folderPath ? event.params.folderPath : '';
    query.path = folderPath;
    // Put your logic here
    const { data } = await Client(token).post('files/list_folder', query);
    return {data: data.entries};
  }
}

/**
 * Typing
 */
export type Params = {
  folderPath: string;
}

export type ReturnedData = File[];
