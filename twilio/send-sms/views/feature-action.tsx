/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import { EventEmitter, Event, BearerFetch, Intent, Prop, RootComponent, State } from '@bearer/core'
import '@bearer/ui'
import IconTwilio from './icons/icon-twilio'

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
    @Prop() fromNumber: string;
    @Prop() messageBody: string = 'Greeting from Bearer';

    @State() receiverNumber: string;
    @State() errorMessage: string;

    @Intent('sendSMS') sendSMS: BearerFetch;

    @Event({eventName: 'sent'})
    sent: EventEmitter<any>;

    sendSms = () => {
        this.errorMessage = this.receiverNumber ? null : 'Missing phone number';
        this.sendSMS({
            fromNumber: this.fromNumber,
            receiverNumber: this.receiverNumber,
            messageBody: this.messageBody
        }).then(
            () => {
                this.sent.emit(this.receiverNumber);
                this.receiverNumber = '';
            }
        ).catch(
            console.log
        );
    };

    handleChange = (event) => {
        this.receiverNumber = event.target.value;
    };


    render() {
        return (
            <div>
                <input class="phone-number-input"
                       placeholder="+xx xxx xxx xxx"
                       type="text" value={this.receiverNumber}
                       onInput={(event) => this.handleChange(event)}
                />
                <bearer-button kind="embed" data-tooltip-type="error" data-tooltip={this.errorMessage} onClick={this.sendSms}>
                    <IconTwilio/>
                    <span>Receive by SMS</span>
                </bearer-button>
            </div>

        );
    }

}
