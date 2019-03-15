import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'
import { Calendar } from '../views/types'
import { results as query } from './queries';

export default class ListCalendarsIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    // Put your logic here
    const { data } = await Client(token).get('users/me/calendarList', {params: query});
    return { data: data.items }
  }
}

/**
 * Typing
 */
export type Params = {}

export type ReturnedData = Calendar[]
