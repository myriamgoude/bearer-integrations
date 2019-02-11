/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import {Event, EventEmitter, Input, Output, RootComponent} from '@bearer/core'
import '@bearer/ui'
import {File} from "./types";

@RootComponent({
    role: 'action',
    group: 'edit'
})
export class EditAction {
    @Input({group: 'feature'}) folders: File[] = [];
    @Output({
        intentName: 'saveFolders',
        intentPropertyName: 'folders',
        intentReferenceIdKeyName: "referenceId"
    })
    displayedFolder: File[];

    @Event({ eventName: "removed", bubbles: true })
    removed: EventEmitter<File>;

    handleRemove = (folder: File) => {
        (this as any).displayedFolderRefId = (this as any).foldersRefId;
        const updatedList = this.folders.filter((elm: File) => folder.id !== elm.id);
        this.folders = [...updatedList];
        this.displayedFolder = [...updatedList];
        this.removed.emit(folder);
    };

    render() {
        return (
            <div>
                <folder-display items={this.folders} onDelete={this.handleRemove} isEditComponent={true} />
            </div>
        )
    }
}
