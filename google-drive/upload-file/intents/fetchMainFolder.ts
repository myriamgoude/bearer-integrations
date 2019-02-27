import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'
import { File } from '../views/types'

export default class FetchMainFolderIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action({ context, params }: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = context.authAccess.accessToken
    const { data } = await Client(token).get(`/${params.folderId}`, { params: { fields: '*' } })
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ')
      return { error: message }
    }
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  folderId: string
}

export type ReturnedData = File[]
