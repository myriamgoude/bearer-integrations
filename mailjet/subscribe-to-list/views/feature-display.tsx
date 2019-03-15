/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import { RootComponent, State, Listen } from '@bearer/core'
import '@bearer/ui'
import IconSuccess from './icons/icon-success'

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {
  @State() contactLists: string[];
  @State() listFromProp: boolean;
  @State() showMessage: boolean = false;

  @Listen('body:feature-subscribed')
  smsSentHandler(e: CustomEvent) {
    this.showMessage = true;
    this.contactLists = e.detail.list
    this.listFromProp = e.detail.listFromProp
  }

  renderMessage() {
    return (
        <div class="success-message">
          <IconSuccess />
          {this.contactLists ? <span>Thank you! You subscribed to <strong>{this.contactLists.join(', ')}</strong> lists</span> : <span>Thank you! You subscribed to mailing list</span>}
        </div>
    )
  }

  render() {
    return (
        this.showMessage ? this.renderMessage() : null
    )
  }
}
