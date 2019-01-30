import { TAPIKEYAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client'

export default class SubscribeUserIntent extends FetchData implements FetchData<ReturnedData, any, TAPIKEYAuthContext> {
  async action(event: TFetchActionEvent<Params, TAPIKEYAuthContext>): TFetchPromise<ReturnedData> {
    try {
      await Client(event.context.authAccess.apiKey).post(`/lists/${event.params.list_id}/members`, {
        status: 'subscribed',
        email_address: event.params.email
      })
      return { data: {} }
    } catch (error) {
      // return if its an expected type of api error otherwise rethrow
      if (error.response && error.response.data) {
        return { error: error.response.data }
      }
      throw error
    }
  }
}

/**
 * Typing
 */
export type Params = {
  list_id: string
  email: string
}

export type ReturnedData = {
  // foo: string[]
}
