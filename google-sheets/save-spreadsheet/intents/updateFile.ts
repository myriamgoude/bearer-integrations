import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client'
import { File, Folder } from '../views/types'

export default class UpdateFileIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action({ context, params }: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = context.authAccess.accessToken
    const { data } = await Client(token).get(`/${params.sheetId}`, { params: { fields: '*' } })
    const file = await Client(token).patch(
      `/${params.sheetId}`,
      {},
      { params: { removeParents: data.parents[0], addParents: params.folderId, fields: '*' } }
    )

    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ')
      return { error: message }
    }
    console.log({ file: file.data })
    return { data: file.data }
  }
}

/**
 * Typing
 */
export type Params = {
  folderId: string
  sheetId: string
}

export type ReturnedData = File
