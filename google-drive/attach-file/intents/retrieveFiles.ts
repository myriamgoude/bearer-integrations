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
    const pulls = (event.context.reference) ? event.context.reference.files : [];
    pulls.forEach(file => {
      promises.push(Client(token).get(`/${file}`, {params: {fields: '*'}}));
    });
    const data = await Promise.all(promises);
    // return {data: data.data};
    return { data: data.map(item => item.data) };
  }
}

/**
 * Typing
 */
export type Params = {
  files: string[];
}

export type ReturnedData = File[];
