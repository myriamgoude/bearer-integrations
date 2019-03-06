import { TAPIKEYAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import {Invoice} from '../views/types'
// Uncomment this line if you need to use Client
import Client from './client';

export default class RetrieveInvoicesIntent extends FetchData implements FetchData<ReturnedData, any, TAPIKEYAuthContext> {
    async action(event: TFetchActionEvent<Params, TAPIKEYAuthContext>): TFetchPromise<ReturnedData> {
        // Put your logic here
        let promises = [];
        const token = event.context.authAccess.apiKey;
        const invoices = (event.context.reference) ? event.context.reference.invoices : [];
        for (let invoice of invoices) {
            promises.push(Client(token).get(`invoices/${invoice.id}`));
        }
        let data = await Promise.all(promises);
        data = data.map(item => item.data);
        return { data };
    }
}

/**
 * Typing
 */
export type Params = {
    invoices: string[];
}

export type ReturnedData = Invoice[];
