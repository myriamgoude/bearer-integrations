import { TBASICAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import qs from 'qs'
import Client from './client'

export default class SendSmsIntent extends FetchData implements FetchData<ReturnedData, any, TBASICAuthContext> {
  async action(event: TFetchActionEvent<Params, TBASICAuthContext>): TFetchPromise<ReturnedData> {
    try {
      console.log(event)
      const { username, password } = event.context.authAccess

      const { data } = await Client(username, password).post(
        '/Messages.json',
        qs.stringify({
          From: decodeURIComponent(event.params.fromNumber),
          To: decodeURIComponent(event.params.toNumber),
          Body: event.params.messageBody
        })
      )

      return { data }
    } catch (error) {
      console.error(error)
      if (error.response && error.response.data) {
        return { error: { code: error.response.status, message: error.response.data.message } }
      }
      return error
    }
  }
}

/**
 * Typing
 */
export type Params = {
  fromNumber: string
  toNumber: string
  messageBody: string
}

export type ReturnedData = {}
