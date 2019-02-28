import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from './client'
import { File } from '../views/types'

export default class RetrieveFoldersIntent extends FetchData
  implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action({ context }: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = context.authAccess.accessToken
    const folders: any[] = context.reference ? context.reference.folders : []
    const promises: Promise<{ data: any }>[] = folders.reduce((acc, folder) => {
      acc.push(Client(token).get(`/${folder.id}`, { params: { fields: '*' } }))
      return acc
    }, [])
    const data = await Promise.all(promises)

    const folderList = data
      .map(item => item.data)
      .map(folder => {
        folders.forEach(folderWithPath => {
          if (folder.id === folderWithPath.id) {
            folder.path = folderWithPath.path
          }
        })
        return folder
      })
    return { data: folderList }
  }
}

/**
 * Typing
 */
export type Params = {
  folders: string[]
}

export type ReturnedData = File[]
