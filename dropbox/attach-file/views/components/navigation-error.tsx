import { Component, Prop } from '@bearer/core'

@Component({ tag: 'navigation-error', styleUrl: 'navigation-error.css' })
export class NavigationError {
  @Prop() message: string = 'Unknown error.'
  @Prop() onRetry: (e: Event) => void

  render() {
    return [
      <div class='alert error'>{this.message}</div>,
      <bearer-button kind='secondary' onClick={this.onRetry}>
        Retry
      </bearer-button>
    ]
  }
}
