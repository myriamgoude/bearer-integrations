/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {Event, EventEmitter, Input, Output, RootComponent} from '@bearer/core'
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

  @Event({ eventName: "removed", bubbles: true })
  removed: EventEmitter<File>;

  handleRemove = (file: File) => {
    (this as any).displayedFileRefId = (this as any).filesRefId;
    const updatedList = this.files.filter((elm: File) => file.id !== elm.id);
    this.files = [...updatedList];
    this.displayedFiles = [...updatedList];
    this.removed.emit(file)
  };
  render() {
    return <file-display items={this.files} onDelete={this.handleRemove} />
  }
}
