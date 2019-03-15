import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'
import { GoogleEvent } from '../views/types'

export default class ListEventsIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const body = event.params;
    const { data } = await Client(token).post(`calendars/${event.params.calendarId}/events`, JSON.parse(body.data));
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ')
      return { error: message }
    }

    return { data: data }
  }
}

/**
 * Typing
 */
export type Params = {
  calendarId: string
  data: any
}

export type ReturnedData = GoogleEvent[]
