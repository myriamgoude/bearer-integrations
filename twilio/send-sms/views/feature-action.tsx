/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import { EventEmitter, Event, BearerFetch, Intent, Prop, RootComponent, State } from '@bearer/core'
import '@bearer/ui'
import IconTwilio from './icons/icon-twilio'

export interface SMS {
  fromNumber: string
  toNumber: string
  messageBody: string
}
@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
  @Prop() fromNumber: SMS['fromNumber']
  @Prop() toNumber: SMS['toNumber']
  @Prop() messageBody: SMS['messageBody']

  @State() tooltip: any

  SMS: SMS
  internalFromNumber: SMS['fromNumber']
  internalToNumber: SMS['fromNumber']
  internalMessageBody: SMS['fromNumber']

  @Intent('send-sms') sendSms: BearerFetch

  @Event({ eventName: 'sent' })
  sent: EventEmitter<any>

  handleSubmit = (e: MouseEvent) => {
    e.preventDefault()

    try {
      this.SMS = {
        fromNumber: this.internalFromNumber ? encodeURIComponent(this.internalFromNumber.trim()) : '',
        toNumber: this.internalToNumber ? encodeURIComponent(this.internalToNumber.trim()) : '',
        messageBody: this.internalMessageBody ? encodeURIComponent(this.internalMessageBody.trim()) : ''
      }

      if (this.SMS.toNumber === '') {
        throw Error('The recipient number is not set')
      } else if (this.SMS.fromNumber === '') {
        throw Error('The from number is not set')
      } else if (this.SMS.messageBody === '') {
        throw Error('The SMS message is empty')
      }

      this.hideTooltip()

      this.sendSms(this.SMS)
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
      case 'fromNumber':
        this.internalFromNumber = value
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
      }, 6200)
    }
  }

  hideTooltip = () => {
    if (this.tooltip && this.tooltip.timer) {
      clearTimeout(this.tooltip.timer)
    }
    this.tooltip = null
  }

  componentDidLoad() {
    this.internalFromNumber = this.fromNumber
    this.internalToNumber = this.toNumber
    this.internalMessageBody = this.messageBody
  }

  componentDidUnload() {
    this.hideTooltip()
  }

  render() {
    return (
      <div>
        {!this.fromNumber && (
          <input type='tel' placeholder='Enter from number' onChange={e => this.handleChange(e, 'fromNumber')} />
        )}
        {!this.toNumber && (
          <input placeholder='Enter the recipient number' type='tel' onChange={e => this.handleChange(e, 'toNumber')} />
        )}
        {!this.messageBody && (
          <textarea class="input-styling" placeholder='Enter message' onChange={e => this.handleChange(e, 'messageBody')} />
        )}
        <bearer-button
          kind='embed'
          data-tooltip-type={this.tooltip && this.tooltip.type}
          data-tooltip={this.tooltip && this.tooltip.message}
          onClick={this.handleSubmit}
        >
          <IconTwilio />
          <span>Receive by SMS</span>
        </bearer-button>
      </div>
    )
  }
}

// From: '+14159911479', //event.params.fromNumber,
// To: '+33660334084', //event.params.receiverNumber,
// Body: event.params.messageBody
