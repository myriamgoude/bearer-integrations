import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import {Forms} from '../views/types'
// Uncomment this line if you need to use Client
import Client from './client';

export default class RetrieveFomsIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
    async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
        // Put your logic here
        let promises = [];
        const token = event.context.authAccess.accessToken;
        const forms = (event.context.reference) ? event.context.reference.forms : [];
        for (let form of forms) {
            console.log(form);
            promises.push(Client(token).get(`/${form.id}`));
        }
        let data = await Promise.all(promises);
        console.log(data);
        data = data.map(item => item.data);
        return { data };
    }
}

/**
 * Typing
 */
export type Params = {
    forms: string[];
}

export type ReturnedData = Forms[];
