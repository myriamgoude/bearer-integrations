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
    const folders = data.entries.filter(item => item['.tag'] === 'folder');
    const files = data.entries.filter(item => item['.tag'] === 'file').sort((a, b) => {
        a = new Date(a['client_modified']);
        b = new Date(b['client_modified']);
        return b - a;
    });
    return {data: [...folders, ...files]};
  }
}

/**
 * Typing
 */
export type Params = {
  folderPath: string;
}

export type ReturnedData = File[];
