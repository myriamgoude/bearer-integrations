import { TBASICAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import qs from 'qs'
// Uncomment this line if you need to use Client
import Client from './client'

export default class SendSMSIntent extends FetchData implements FetchData<ReturnedData, any, TBASICAuthContext>{
  async action(event: TFetchActionEvent<Params, TBASICAuthContext>): TFetchPromise<ReturnedData> {
    const { username, password } = event.context.authAccess;
    // Put your logic here
    
    console.log(event.params);

    await Client(username, password).post('/Messages.json', qs.stringify({
      From: event.params.fromNumber,
      To: event.params.receiverNumber,
      Body: event.params.messageBody
    })).catch(console.log)
    return { data: [] }
  }
}

/**
 * Typing
 */
export type Params = {
  // name: string
  fromNumber: string;
  receiverNumber: string;
  messageBody: string;
}

export type ReturnedData = {
  // foo: string[]
}
