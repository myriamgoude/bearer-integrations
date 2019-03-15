/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {Listen, RootComponent, State} from '@bearer/core'
import '@bearer/ui'
import {GoogleEvent} from './types'

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {

  @State() event: GoogleEvent = undefined;

  @Listen('body:feature-created')
  resolveEvent(e) {
    debugger
    this.event = e.detail;
  }

  render() {
    return <event-display item={this.event} />
  }
}
