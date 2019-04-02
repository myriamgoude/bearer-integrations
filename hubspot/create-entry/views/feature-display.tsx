/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {Listen, RootComponent, State} from '@bearer/core'
import '@bearer/ui'

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {

  @State() event: any = undefined;

  @Listen('body:feature-created')
  resolveEvent(e) {
    this.event = e.detail;
  }

  render() {
    return <event-display item={this.event} />
  }
}
