import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'
import {File} from '../views/types'

export default class RetrieveFoldersIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    let promises = [];
    const token = event.context.authAccess.accessToken;
    const folders = (event.context.reference) ? event.context.reference.folders : [];
    console.log(folders);
    folders.forEach(folder => {
      promises.push(Client(token).get(`/${folder.id}`, {params: {fields: '*'}}));
    });
    let data = await Promise.all(promises);
    data = data.map(item => item.data);
    data.forEach(folder => {
      folders.forEach(folderWithPath => {
        if (folder.id === folderWithPath.id) {
          folder.path = folderWithPath.path;
        }
      })
    });
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  folders: string[];
}

export type ReturnedData = File[];
