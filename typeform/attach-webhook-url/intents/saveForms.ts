import { TOAUTH2AuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents'
import { Forms } from '../views/types'

export default class SaveFormsIntent extends SaveState implements SaveState<State, ReturnedData, any, TOAUTH2AuthContext> {
    async action(event: TSaveActionEvent<State, Params, TOAUTH2AuthContext>): TSavePromise<State, ReturnedData> {
        const { forms } = event.params;
        return {
            state: {
                forms: forms.map(form => {return {id: form.id}})
            },
            data: forms
        }
    }
}

/**
 * Typing
 */
export type Params = {
    forms: Forms[];
}

export type State = {
    forms: any[];
}

export type ReturnedData = Forms[];
