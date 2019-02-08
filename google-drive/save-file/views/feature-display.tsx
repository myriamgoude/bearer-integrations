/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {Input, RootComponent} from '@bearer/core'
import '@bearer/ui'
import {File} from "./types";

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {
  @Input() folders: File[];

  render() {
    return <folder-display items={this.folders} />
  }
}
