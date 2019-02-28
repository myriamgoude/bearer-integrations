import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client';
import {File} from "../views/types";
import { folders as query } from './queries';

export default class FetchMainFolderIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const folderPath = event.params.folderPath ? event.params.folderPath : '';
    query.path = folderPath;
    delete query.include_mounted_folders;
    const { data } = await Client(token).post('/files/get_metadata', query);
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ');
      return { error: message }
    }
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  folderPath: string;
}

export type ReturnedData = File;
