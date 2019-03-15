import { Component, Prop } from '@bearer/core'
import { File } from '../types'
import IconView from '../icons/icon-view'

@Component({
  tag: 'folder-display',
  styleUrl: 'folder-display.css',
  shadow: true
})
export class FolderDisplay {
  @Prop() item: File

  render() {
    if (!this.item) {
      return null
    }

    return (
        <div class="display-container">
          <div class="display-text">
            <span><strong>{this.item.name}</strong></span>
            <span>{this.item.name}</span>
          </div>
          <a href={this.item.webViewLink}><IconView /></a>
        </div>
    )
  }
}
