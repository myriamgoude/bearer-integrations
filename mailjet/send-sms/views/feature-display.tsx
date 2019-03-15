/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import { RootComponent, State, Listen } from '@bearer/core'
import '@bearer/ui'

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {
  @State() toNumber: string

  @Listen('body:feature-sent')
  smsSentHandler(e: CustomEvent) {
    this.toNumber = decodeURIComponent(e.detail.toNumber)
  }

  render() {
    if (!this.toNumber) {
      return
    }
    return (
        <div class='displayed-text'>
          <span>
            Thank you! SMS has been sent to <strong>{this.toNumber}</strong>
          </span>
        </div>
    )
  }
}
