import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import {File} from '../views/types'
// Uncomment this line if you need to use Client
import Client from './client'

export default class RetrieveFilesIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    // const token = event.context.authAccess.accessToken
    // Put your logic here
    let promises = [];
    const token = event.context.authAccess.accessToken;
    const files = (event.context.reference) ? event.context.reference.files : [];
    files.forEach(file => {
      promises.push(Client(token).get(`/${file.id}`, {params: {fields: '*'}}));
    });
    let data = await Promise.all(promises);
    data = data.map(item => item.data);
    data.forEach(file => {
      files.forEach(fileWithPath => {
        if (file.id === fileWithPath.id) {
          file.path = fileWithPath.path;
        }
      })
    });
    return { data };
  }
}

/**
 * Typing
 */
export type Params = {
  files: string[];
}

export type ReturnedData = File[];
