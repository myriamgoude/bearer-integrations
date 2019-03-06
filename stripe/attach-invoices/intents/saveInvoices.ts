import { TOAUTH2AuthContext, SaveState, TSaveActionEvent, TSavePromise } from '@bearer/intents'
import { Invoice } from '../views/types'

export default class SaveInvoicesIntent extends SaveState implements SaveState<State, ReturnedData, any, TOAUTH2AuthContext> {
    async action(event: TSaveActionEvent<State, Params, TOAUTH2AuthContext>): TSavePromise<State, ReturnedData> {
        const { invoices } = event.params;
        console.log(event.params);
        return {
            state: {
                invoices: invoices.map(invoice => {return {id: invoice.id}})
            },
            data: invoices
        }
    }
}

/**
 * Typing
 */
export type Params = {
    invoices: any[];
}

export type State = {
    invoices: any[];
}

export type ReturnedData = Invoice[];
