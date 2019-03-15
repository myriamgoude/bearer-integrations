
import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client';
import { folders } from './queries';
import { File } from '../views/types'

export default class SearchDataIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
    async action({ context, params }: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
        const token = context.authAccess.accessToken
        const type = 'application/vnd.google-apps.folder'
        const { orderBy, ...folderQuery } = folders

        const q = `mimeType = "${type}" and name contains '${
            params.query
            }' or mimeType = "${type}" and fullText contains '${params.query}'`

        const { data } = await Client(token).get('', { params: { ...folderQuery, q } })

        if (data.errors) {
            const message = data.errors.map((e: { message: string }) => e.message).join(', ')
            return { error: message }
        }

        return { data: data.files }
    }
}

/**
 * Typing
 */
export type Params = {
    query: string
}

export type ReturnedData = File[];
