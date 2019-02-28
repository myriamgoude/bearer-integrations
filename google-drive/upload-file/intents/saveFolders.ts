import { TOAUTH2AuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents'
import { File } from '../views/types'

export default class SaveFoldersIntent extends SaveState
  implements SaveState<State, ReturnedData, any, TOAUTH2AuthContext> {
  async action({
    params: { folders }
  }: TSaveActionEvent<State, Params, TOAUTH2AuthContext>): TSavePromise<State, ReturnedData> {
    return {
      state: {
        folders: folders.map(folder => ({
          id: folder.id,
          path: folder.path
        }))
      },
      data: folders
    }
  }
}

/**
 * Typing
 */
export type Params = {
  folders: File[]
}

export type State = {
  folders: any[]
}

export type ReturnedData = File[]
