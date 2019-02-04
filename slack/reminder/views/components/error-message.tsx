import { Component, Prop } from '@bearer/core'

@Component({
  tag: 'error-message',
  shadow: true,
  styleUrl: 'error-message.css'
})
export class ErrorMessage {
  //callback with matching hashkeys
  @Prop() onRetry: (e: Event) => void
  @Prop() message: string

  render() {
    return (
      <div>
        <p>{this.message}</p>
        <button onClick={this.onRetry}>
          <bearer-i18n key="messages.rety" default="Retry" />
        </button>
      </div>
    )
  }
}
