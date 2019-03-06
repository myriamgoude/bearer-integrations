import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import Client from './client';
import { form as query } from './queries';
import { Forms } from "../views/types";

export default class ListDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const { data }  = await Client(token).get('', {params: query});
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ');
      return { error: message }
    }
    return { data: data.items }
  }
}

/**
 * Typing
 */
export type Params = {
  folderId: string;
}

export type ReturnedData = Forms[];
