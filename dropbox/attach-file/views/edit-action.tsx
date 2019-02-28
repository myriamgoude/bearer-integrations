import '@bearer/ui'
import {Event, EventEmitter, Input, Output, RootComponent} from '@bearer/core'
import { File } from './types'

@RootComponent({
  role: 'action',
  group: 'edit'
})
export class EditAction {
  @Input({group: 'feature'}) files: File[] = [];
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
    return (
        <div>
          <file-display items={this.files} onDelete={this.handleRemove} />
        </div>
    )
  }
}
