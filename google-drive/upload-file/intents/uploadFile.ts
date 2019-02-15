import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import axios from 'axios';
import Client from './client';

// Mime module errors on Bearer
// 
// You might face an error with the `mime` module using Bearer.sh sdk:
// ```
// ERROR in ./node_modules/mime/index.js
// Module not found: Error: Can't resolve './types/standard' in '/Users/corentinbrossault/Bearer/integrations-neoteric/pputko/google-drive/upload-file/node_modules/mime'
//  @ ./node_modules/mime/index.js 4:26-53
//  @ ./node_modules/gtoken/build/src/index.js
//  @ ./node_modules/google-auth-library/build/src/auth/jwtclient.js
//  @ ./node_modules/google-auth-library/build/src/auth/googleauth.js
//  @ ./node_modules/google-auth-library/build/src/index.js
//  @ ./node_modules/googleapis/build/src/googleapis.js
//  @ ./node_modules/googleapis/build/src/index.js
//  @ ./intents/uploadFile.ts
// ```
//
// Before we solve this, here is a workaround.
//
// 1. Inside your integration folder, type  `cd node_modules/mime/types`
// 2. then `cp other.json other.js && cp standard.json standard.js`
// 3. Open each new file (other.js and standard.js) to add the following at the beginning : `module.exports =`. This way, these files should look like `module.exports = {…`
// 4. Restart bearer with `yarn start` and voilà!

//@TODO need to figure out how to use axios to upload files to google drive

export default class UploadFileIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
    async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {

        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        const token = event.context.authAccess.accessToken;
        const response = await axios({
          method:'get',
          url: event.params.fileUrl
        });

        const pathArr = response.request.path.split('/');
        const fileName = pathArr[pathArr.length - 1];


        const fileMetadata = {
            'name': fileName,
            'parents': [event.params.folderId]
        };

            axios.defaults.headers['Content-Type'] = 'multipart/related; boundary="' + boundary + '"';
            let multipartRequestBody = delimiter +  'Content-Type: application/json\r\n\r\n' + JSON.stringify(fileMetadata) + delimiter + 'Content-Type: ' + `${response.headers['content-type']}\r\n\r\n` + response.data + close_delim;
            Client(token, 'upload').post('', multipartRequestBody, {params: {uploadType: 'multipart'}}).catch(({response})=> console.log(response.data.error));


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
