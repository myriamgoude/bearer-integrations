import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client';
import {File} from "../views/types";

export default class FetchPreviousFolderIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
    async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
        const token = event.context.authAccess.accessToken;
        const fileId = event.params.fileId ? event.params.fileId : '';
        const { data } = await Client(token).post('/files/get_temporary_link', {path: fileId});
        if (data.errors) {
            const message = data.errors.map((e: { message: string }) => e.message).join(', ');
            return { error: message }
        }

        return { data }
    }
}

/**
 * Typing
 */
export type Params = {
    fileId: string;
}

export type ReturnedData = File;
