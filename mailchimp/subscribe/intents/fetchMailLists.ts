import { TAPIKEYAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client'

export default class fetchMailListsIntent extends FetchData
  implements FetchData<ReturnedData, any, TAPIKEYAuthContext> {
  async action(event: TFetchActionEvent<Params, TAPIKEYAuthContext>): TFetchPromise<ReturnedData> {
    try {
      const result = (await Client(event.context.authAccess.apiKey).get('/lists')).data
      const data = result.lists.map(({ name, id }: { name: string; id: string }) => ({ id, name }))
      return { data }
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

type MailingList = {
  id: string
  name: string
}

export type ReturnedData = MailingList[]
