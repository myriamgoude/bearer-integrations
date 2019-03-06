import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import axios from 'axios'
import { google } from 'googleapis'
import { File } from '../views/types'

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

export default class UploadFileIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action({ context, params }: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = context.authAccess.accessToken
    const OAuth2 = google.auth.OAuth2
    const oauth2Client = new OAuth2()
    oauth2Client.setCredentials({ access_token: token })

    const response = await axios({
      method: 'get',
      url: params.fileUrl,
      responseType: 'stream'
    })

    const pathArr = response.request.path.split('/')
    const fileName = pathArr[pathArr.length - 1]
    const fileMetadata = {
      name: fileName,
      mimeType: response.headers['content-type'],
      parents: [params.folderId]
    }

    const { data } = await google.drive({ version: 'v3', auth: oauth2Client }).files.create({
      //@ts-ignore
      requestBody: fileMetadata,
      media: {
        mimeType: response.headers['content-type'],
        body: response.data
      }
    })

    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  fileUrl: string
  folderId: string
}

export type ReturnedData = File[]
