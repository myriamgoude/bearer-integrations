import { TOAUTH2AuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents';
import { File } from '../views/types';

export default class SaveFoldersIntent extends SaveState implements SaveState<State, ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TSaveActionEvent<State, Params, TOAUTH2AuthContext>): TSavePromise<State, ReturnedData> {
    const { folders } = event.params;
    return {
      state: {
        folders: folders.map(folder => {return {id: folder.id, name: folder.name, path_lower: folder.path_lower, path_display: folder.path_display}})
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
  folders: any[];
}

export type ReturnedData = File[];


