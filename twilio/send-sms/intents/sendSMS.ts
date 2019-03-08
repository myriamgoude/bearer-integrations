import { TBASICAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import qs from 'qs'
import Client from './client'

export default class SendSMSIntent extends FetchData implements FetchData<ReturnedData, any, TBASICAuthContext> {
  async action(event: TFetchActionEvent<Params, TBASICAuthContext>): TFetchPromise<ReturnedData> {
    const { username, password } = event.context.authAccess
    console.log(event.params)
    try {
      const { data } = await Client(username, password).post(
        '/Messages.json',
        qs.stringify({
          From: event.params.fromNumber,
          To: event.params.toNumber,
          Body: event.params.messageBody
        })
      )

      return { data }
    } catch (error) {
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
