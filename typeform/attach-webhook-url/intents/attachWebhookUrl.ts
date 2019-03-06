import { TOAUTH2AuthContext, FetchData, TFetchActionEvent, TFetchPromise } from '@bearer/intents'
import Client from "./client";
import {Forms} from "../views/types";


export default class AttachWebhookUrlIntent extends FetchData implements FetchData<ReturnedData, any, TOAUTH2AuthContext> {
  async action(event: TFetchActionEvent<Params, TOAUTH2AuthContext>): TFetchPromise<ReturnedData> {
    const token = event.context.authAccess.accessToken;
    const { data }  = await Client(token).put(`/${event.params.formId}/webhooks/${event.params.tag}`, {
        url: event.params.webhookUrl,
        enabled: true
    });

    if (data.errors) {
      const message = data.errors.map((e: { message: string }) => e.message).join(', ');
      console.error(data);
      return { error: message }
    }

    console.debug(data);
    return { data }
  }
}

/**
 * Typing
 */
export type Params = {
  formId: string;
  tag: string;
  webhookUrl: string;
}

export type ReturnedData = Forms[];
