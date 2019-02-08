import { TOAUTH2AuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents'
import { File } from '../views/types'

export default class SaveFilesIntent extends SaveState implements SaveState<State, ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TSaveActionEvent<State, Params, TOAUTH2AuthContext>): TSavePromise<State, ReturnedData> {
    const { files } = event.params;
    return {
      state: {
        files: files.map(file => file.id)
      },
      data: files
    }
  }
}

/**
 * Typing
 */
export type Params = {
  files: File[];
}

export type State = {
  files: string[];
}

export type ReturnedData = File[];
