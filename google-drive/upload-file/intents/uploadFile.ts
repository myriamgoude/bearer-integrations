import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import axios from 'axios';
// const {google} = require('googleapis');

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

        // const token = event.context.authAccess.accessToken;
        //
        // const response = await axios({
        //   method:'get',
        //   url: event.params.fileUrl,
        //   responseType: 'stream'
        // });
        //
        // const credentials = {"installed":{"client_id":"69987490611-qcfiic2a1jumtac6ufkel03bhphg96nh.apps.googleusercontent.com","client_secret":"Svw6bZ326WHzgZBV7G2pS5wM","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}};
        // const token = {"access_token":"ya29.GluwBu8e1PUs9KzOPUqZdqJDJv_KxkwVorDYCufsIiGDCtwaMQ3Cta4IjI5PcYCO6luyFJFeEfLDGVPODSLC99tybioz05xeJf0rz5hA2auRYnj_TQh_yfUyvG72","refresh_token":"1/rZI8V19Q2ufqAmxwM-knDcjHU65dFXhmG9nfyqVgm6iN7QxTsjZBUibp3N5RV4yA","scope":"https://www.googleapis.com/auth/drive.file","token_type":"Bearer","expiry_date":1550153657444}
        //
        // const {client_secret, client_id, redirect_uris} = credentials.installed;
        // const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        // oAuth2Client.setCredentials(token);
        //
        // const drive = google.drive({version: 'v3', auth: oAuth2Client});
        // var fileMetadata = {
        //     'name': 'bear.png',
        //     'parents': [event.params.folderId]
        // };
        //
        // var media = {
        //     mimeType: 'image/png',
        //     body: response.data
        // };
        //
        // const driveResponse = await drive.files.create({
        //     // @ts-ignore
        //     resource: fileMetadata,
        //     media: media,
        //     fields: 'id'
        //   });
        //
        // console.log(driveResponse);

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
