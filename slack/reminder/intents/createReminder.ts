import { FetchData, TOAUTH2AuthContext, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'

export default class CreateReminderIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    try {
      const { what, when } = event.params
      console.log('parmas', what, when)
      const { data } = await Client(event.context.authAccess.accessToken).post('reminders.add', {
        text: what,
        time: when
      })
      return { data }
    } catch (e) {
      return { error: e.toString() }
    }
  }
}

export type Params = {
  what: string
  when: string
}

export type ReturnedData = {
  ok: boolean
  reminder: {
    id: string
    creator: string
    user: string
    text: string
    recuring: boolean
    time: number
    complete_ts: number
  }
}
