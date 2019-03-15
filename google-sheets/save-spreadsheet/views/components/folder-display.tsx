import { Component, Prop } from '@bearer/core'
import { File, Folder } from '../types'
import IconView from '../icons/icon-view'

@Component({
  tag: 'folder-display',
  styleUrl: 'folder-display.css',
  shadow: true
})
export class FolderDisplay {
  @Prop() file: File
  @Prop() folder: Folder

  render() {
    if (!this.file) {
      return null
    }

    console.log(this.file)

    return (
      <div class='display-container'>
        <div class='display-text'>
          <span>
            <strong>{this.file.name}</strong>
          </span>
          <span>{this.folder && this.folder.name}</span>
        </div>
        <a href={this.file.webViewLink}>
          <IconView />
        </a>
      </div>
    )
  }
}
