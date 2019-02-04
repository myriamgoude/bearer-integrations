import { FetchData, TOAUTH2AuthContext, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'

export default class DeleteReminderIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    try {
      const { reminder } = event.params
      const { data } = await Client(event.context.authAccess.accessToken).post('reminders.delete', {
        reminder
      })
      return { data }
    } catch (e) {
      return { error: e.toString() }
    }
  }
}

export type Params = {
  reminder: string
}

export type ReturnedData = {
  ok: boolean
}
