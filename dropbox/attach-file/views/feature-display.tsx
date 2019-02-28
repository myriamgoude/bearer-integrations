/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {Input, Output, RootComponent} from '@bearer/core'
import '@bearer/ui'
import {File} from './types'

@RootComponent({
  role: 'display',
  group: 'feature'
})
export class FeatureDisplay {
  @Input() files: File[] = [];
  @Output({
    intentName: 'saveFiles',
    intentPropertyName: 'files',
    intentReferenceIdKeyName: "referenceId"
  })
  displayedFiles: File[] = [];

  render() {
    return <file-display items={this.files} />
  }
}
