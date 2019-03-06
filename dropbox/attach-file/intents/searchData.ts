import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'

export default class SearchDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken
    const params = event.params
    const { data } = await Client(token).post('/files/search', { path: '//', query: params.query, mode: 'filename' })
    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ')
      return { error: message }
    }
    // Put your logic here
    const folders = data.matches.map(item => item.metadata).filter(item => item['.tag'] === 'folder')
    const files = data.matches
      .map(item => item.metadata)
      .filter(item => item['.tag'] === 'file')
      .sort((a, b) => {
        a = new Date(a['client_modified'])
        b = new Date(b['client_modified'])
        return b - a
      })

    return { data: [...folders, ...files] }
  }
}

/**
 * Typing
 */
export type Params = {
  query: string
}

export type ReturnedData = any[]
