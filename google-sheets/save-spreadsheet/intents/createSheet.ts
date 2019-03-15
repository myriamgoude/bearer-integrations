import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
// Uncomment this line if you need to use Client
import Client from './client'

export default class CreateSheetIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const date = new Date();
    const { data } = await Client(token, 'sheet').post('', {
      sheets: [{
        properties: {
          title: 'Test'
        }
      }],
      properties: {
        title: `${event.params.sheetName}-${date.toLocaleDateString().replace(/\./g, '')}-${date.getHours()}${date.getMinutes()}`
      }
    });
    if (event.params.data) {
      await Client(token, 'sheet').post(`${data.spreadsheetId}/values/A1:append`, {values: JSON.parse(event.params.data)}, {params: {valueInputOption: 'RAW'}});
    }
    // Put your logic here
    return { data: data }
  }
}

/**
 * Typing
 */
export type Params = {
  data: any;
  sheetName: string;
}

export type ReturnedData = {
  // foo: string[]
}
