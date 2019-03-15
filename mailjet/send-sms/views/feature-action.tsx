/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import { RootComponent, Prop, State, Event, EventEmitter, Intent, BearerFetch } from '@bearer/core'
import '@bearer/ui'
import IconMailjet from './icons/icon-mailjet'


export interface SMS {
    senderName: string
    toNumber: string
    messageBody: string
}
@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
    @Prop() senderName: SMS['senderName']
    @Prop() toNumber: SMS['toNumber']
    @Prop() messageBody: SMS['messageBody']

    @State() tooltip: any

    SMS: SMS
    internalSenderName: SMS['senderName']
    internalToNumber: SMS['toNumber']
    internalMessageBody: SMS['messageBody']

    @Intent('sendSMS') sendSMS: BearerFetch

    @Event({ eventName: 'sent' })
    sent: EventEmitter<any>

    handleSubmit = (e: MouseEvent) => {
        e.preventDefault()

        try {
            this.SMS = {
                senderName: this.internalSenderName ? encodeURIComponent(this.internalSenderName.trim()) : '',
                toNumber: this.internalToNumber ? encodeURIComponent(this.internalToNumber.trim()) : '',
                messageBody: this.internalMessageBody ? encodeURIComponent(this.internalMessageBody.trim()) : ''
            }

            if (this.SMS.toNumber === '') {
                throw Error('The recipient number is not set')
            } else if (this.SMS.senderName === '') {
                throw Error('The from number is not set')
            } else if (this.SMS.messageBody === '') {
                throw Error('The SMS message is empty')
            }

            this.hideTooltip()

            this.sendSMS(this.SMS)
                .then(() => {
                    this.showTooltip({ content: 'Message sent!', type: 'success' })
                    this.sent.emit(this.SMS)
                })
                .catch(({ error }) => {
                    this.handleErrors(error)
                })
        } catch (err) {
            this.handleErrors(err)
        }
    }

    handleChange = (event, key) => {
        const value = event.target.value
        switch (key) {
            case 'senderName':
                this.internalSenderName = value
                break
            case 'toNumber':
                this.internalToNumber = value
                break
            case 'messageBody':
                this.internalMessageBody = value
        }
    }

    handleErrors = error => {
        this.showTooltip({ message: error.message, type: 'danger' })
    }

    showTooltip = tooltip => {
        this.tooltip = {
            message: tooltip.message,
            type: tooltip.type,
            timer: setTimeout(() => {
                this.tooltip = null
            }, 3200)
        }
    }

    hideTooltip = () => {
        if (this.tooltip && this.tooltip.timer) {
            clearTimeout(this.tooltip.timer)
        }
        this.tooltip = null
    }

    componentDidLoad() {
        this.internalSenderName = this.senderName
        this.internalToNumber = this.toNumber
        this.internalMessageBody = this.messageBody
    }

    componentDidUnload() {
        this.hideTooltip()
    }

    render() {
        return (
            <div>
                {!this.senderName && (
                    <input type='tel' placeholder='Enter name' onChange={e => this.handleChange(e, 'senderName')} />
                )}
                {!this.toNumber && (
                    <input placeholder='Enter the recipient number' type='tel' onChange={e => this.handleChange(e, 'toNumber')} />
                )}
                {!this.messageBody && (
                    <textarea placeholder='Enter message' onChange={e => this.handleChange(e, 'messageBody')} />
                )}
                <bearer-button
                    kind='embed'
                    data-tooltip-type={this.tooltip && this.tooltip.type}
                    data-tooltip={this.tooltip && this.tooltip.message}
                    onClick={this.handleSubmit}
                >
                    <IconMailjet />
                    <span>Receive by SMS</span>
                </bearer-button>
            </div>
        )
    }
}
