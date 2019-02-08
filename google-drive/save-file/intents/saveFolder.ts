import { TOAUTH2AuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents';
import {File} from '../views/types';

export default class SaveFolderIntent extends SaveState implements SaveState<State, ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TSaveActionEvent<State, Params, TOAUTH2AuthContext>): TSavePromise<State, ReturnedData> {
    console.log(event.params);
    const { folders } = event.params;
      return { state: {folders: folders.map(folder => folder.id)}, data: folders };
  }
}

/**
 * Typing
 */
export type Params = {
  folders: File[];
}

export type State = {
  folders: string[];
}

export type ReturnedData = File[];
