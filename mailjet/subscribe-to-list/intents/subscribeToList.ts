import { TBASICAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from "./client";
import {Contact} from "../views/types";
// Uncomment this line if you need to use Client

export default class SubscribeToListIntent extends FetchData implements FetchData<ReturnedData, any, TBASICAuthContext> {
  async action(event: TFetchActionEvent<Params, TBASICAuthContext>): TFetchPromise<ReturnedData> {
    const { username, password } = event.context.authAccess;
    const promises = [];
    event.params.listId.split(',').forEach(id => {
      promises.push(Client(username, password).post(`${id}/managecontact`, {
        Email: event.params.email,
        Action: 'addforce'
      }))
    })

    await Promise.all(promises).catch(console.log);
    const response = await Promise.all(promises);
    const data = response.map(item => item.data['Data'][0]);
    // Put your logic here
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  listId: string;
  email: string;
}

export type ReturnedData = Contact[]
