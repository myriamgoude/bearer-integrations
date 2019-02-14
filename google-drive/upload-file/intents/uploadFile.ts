import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents';
// Uncomment this line if you need to use Client
import axios from 'axios';
const {google} = require('googleapis');

export default class UploadFileIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
    async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
        const token = 'ya29.GlywBhdeTStVbZxzGP8HgFA7sbMBqU0fm_S6RyeoB6-y2MIEKjbqmrg6OMWsgeLZA_pMCx9RcEsVUlplJqFIDVk_W_WA-bWOgA2lyPoHIeX5HpoRTWJTfhDVvGeUyw';
        const data = await axios.get('https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/250px-Flag_of_Poland.svg.png');



        const drive = google.drive({version: 'v3', auth: token});
        // var fileMetadata = {
        //     'name': 'bearer-logo.png'
        // };
        // var media = {
        //     mimeType: 'image/jpeg',
        //     body: data
        // };
        //
        // drive.files.create({
        //     // @ts-ignore
        //     resource: fileMetadata,
        //     media: media,
        //     fields: 'id'
        // }, function (err, file) {
        //     if (err) {
        //         // Handle error
        //         console.error(err);
        //     } else {
        //         console.log('File Id: ', file.id);
        //     }
        // });




        return {data: ['test']}
    }
}

/**
 * Typing
 */
export type Params = {
    folderId: string;
}

export type ReturnedData = string[];


