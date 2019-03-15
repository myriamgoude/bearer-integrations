import {FetchData, TFetchActionEvent, TFetchPromise, TBASICAuthContext} from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client'
import qs from 'qs'
import {ContactList} from "../views/types";

export default class FetchContactListsIntent extends FetchData implements FetchData<ReturnedData, any, TBASICAuthContext> {
  async action(event: TFetchActionEvent<Params, TBASICAuthContext>): TFetchPromise<ReturnedData> {
    const { username, password } = event.context.authAccess

    const {data} = await Client(username, password).get('');
    return { data: data['Data'] }
  }
}

/**
 * Typing
 */
export type Params = {}

export type ReturnedData = ContactList[]
