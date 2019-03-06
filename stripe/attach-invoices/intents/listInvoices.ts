import { TAPIKEYAuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from "./client";
import {Invoice} from "../views/types";
import {queries as query} from "./queries";


export default class ListInvoicesIntent extends FetchData implements FetchData<ReturnedData, any, TAPIKEYAuthContext> {
  async action(event: TFetchActionEvent<Params, TAPIKEYAuthContext>): TFetchPromise<any> {
    const token = event.context.authAccess.apiKey;
    query.customer = `${event.params.customerId}`;
    
    delete query.query;
    delete query.count;

    let returnedData;

    await Client(token).get(`invoices`, { params: query })
    .then( (res) => {
      returnedData = { data: res.data.data }
    })
    .catch((err) => {
      console.error(err);
      returnedData = { error: err.message }
    })

    return returnedData;
  }
}

/**
 * Typing
 */
export type Params = {
  customerId: string;
}

export type ReturnedData = Invoice[];
