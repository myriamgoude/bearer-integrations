import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'
import { folders } from './queries'
import { File } from '../views/types'

export default class ListDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action({ context, params }: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = context.authAccess.accessToken
    const type = 'application/vnd.google-apps.folder'
    const folderId = params.folderId ? params.folderId : 'root'
    const q = `"${folderId}" in parents and mimeType = "${type}"`
    const folderQuery = { ...folders, q }

    const { data } = await Client(token).get('', { params: folderQuery })
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ')
      return { error: message }
    }
    return { data: data.files }
  }
}

/**
 * Typing
 */
export type Params = {
  folderId: string
}

export type ReturnedData = File[]
