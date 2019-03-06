import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import { File } from '../views/types'
import Client from './client'

export default class RetrieveFilesIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    // const token = event.context.authAccess.accessToken
    // Put your logic here
    let promises = []
    const token = event.context.authAccess.accessToken
    const files = event.context.reference ? event.context.reference.files : []
    for (let file of files) {
      let path = file.id
      promises.push(Client(token).post(`/files/get_metadata`, { path }))
    }
    let data = await Promise.all(promises)
    data = data.map(item => item.data)
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  files: string[]
}

export type ReturnedData = File[]
