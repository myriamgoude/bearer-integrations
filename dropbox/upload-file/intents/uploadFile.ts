import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import axios from 'axios';
import Client from './client';

//@TODO need to figure out how to use axios to upload files to google drive

export default class UploadFileIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
    async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {

        const token = event.context.authAccess.accessToken;

        axios.defaults.headers.post['Content-Type'] = 'application/octet-stream';
        console.log("Fetching ", event.params.fileUrl);
        const response = await axios({
          method:'get',
          url: event.params.fileUrl,
          responseType: 'stream'
        });
        const path = event.params.folderId ? event.params.folderId : '';
        const pathArr = response.request.path.split('/');
        const fileName = pathArr[pathArr.length - 1];
        await Client(token, `${path}/${fileName}`, 'upload').post('', response.data)
        .then(console.log)
        .catch(console.log);

        return {data: ['pending']}
    }
}

/**
 * Typing
 */
export type Params = {
    fileUrl: string;
    folderId: string;
}

export type ReturnedData = string[];
