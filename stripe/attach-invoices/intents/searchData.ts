
import { TAPIKEYAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client';
import { Invoice } from '../views/types'
import { queries as query} from './queries'

export default class SearchDataIntent extends FetchData implements FetchData<ReturnedData, any, TAPIKEYAuthContext> {
    async action(event: TFetchActionEvent<Params, TAPIKEYAuthContext>): TFetchPromise<ReturnedData> {
        const token = event.context.authAccess.apiKey;
        query.query = `${event.params.query}`;
        delete query.customer;
        delete query.limit;
        query.count = 20;
        const { data } = await Client(token).get('search', {params: query});
        if (data.errors) {
            const message = data.errors.map((e: { message: string }) => e.message).join(', ');
            return { error: message }
        }
        // Put your logic here
        return { data: data.data.filter(item => item.object === 'customer') }
    }
}

/**
 * Typing
 */
export type Params = {
    query: string
}

export type ReturnedData = Invoice[];
