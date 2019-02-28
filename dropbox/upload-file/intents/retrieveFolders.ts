import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'
import {File} from '../views/types'

export default class RetrieveFoldersIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    let promises = [];
    const token = event.context.authAccess.accessToken;
    const folders = (event.context.reference) ? event.context.reference.folders : [];
    for (let folder of folders) {
      if (folder.path_display === '') {
        console.log('root');
        return { data: [folder] };
      }
      let path = folder.path_display;
      promises.push(Client(token).post(`/files/get_metadata`, {path}));
    }
    let data = await Promise.all(promises);
    data = data.map(item => item.data);
    return { data };
  }
}

/**
 * Typing
 */
export type Params = {
  folders: string[];
}

export type ReturnedData = File[];
