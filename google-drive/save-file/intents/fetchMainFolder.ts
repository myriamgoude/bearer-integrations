import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from "./client";
import {File} from "../views/types";
// Uncomment this line if you need to use Client
// import Client from './client'

export default class FetchMainFolderIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const { data }  = await Client(token).get(`/${event.params.folderId}`, { params: {fields: '*' }});
    console.log(data);
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  folderId: string;
}

export type ReturnedData = File[];
