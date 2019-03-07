/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {RootComponent, Listen, State} from '@bearer/core'
import '@bearer/ui'

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {
  @State() receiverNumber: string;

  @Listen('body:feature-sent')
  smsSentHandler(e: CustomEvent) {
    this.receiverNumber = e.detail;
  }

  render() {
    if(this.receiverNumber) {
      return (
          <div class="displayed-text">
            <i>I</i>
            <span>Thank you! SMS sent to <strong>{this.receiverNumber}</strong></span>
          </div>
      )
    }
  }
}
