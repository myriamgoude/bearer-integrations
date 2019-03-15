import { TAPIKEYAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client'
import qs from 'qs'

export default class SendSMSIntent extends FetchData implements FetchData<ReturnedData, any, TAPIKEYAuthContext> {
  async action(event: TFetchActionEvent<Params, TAPIKEYAuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.apiKey

    await Client(token).post('', JSON.stringify({
      From: event.params.senderName,
      To: event.params.toNumber,
      Text: event.params.messageBody
    })).catch(console.log)
    return { data: [] }
  }
}

/**
 * Typing
 */
export type Params = {
  senderName: string;
  toNumber: string;
  messageBody: string;
}

export type ReturnedData = {
  // foo: string[]
}
