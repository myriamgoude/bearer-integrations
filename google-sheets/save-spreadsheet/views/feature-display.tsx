/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {Listen, RootComponent, State} from '@bearer/core'
import '@bearer/ui'
import {File} from "./types";

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {
  @State() file: File = undefined;
  @Listen('body:feature-created')
  resolveEvent(e: CustomEvent) {
    this.file = e.detail;
  }

  render() {
    return <folder-display item={this.file} />
  }
}
