import { Component, Prop } from '@bearer/core'
import { File } from '../types'
import IconView from '../icons/icon-view'

@Component({
  tag: 'folder-display',
  styleUrl: 'folder-display.css',
  shadow: true
})
export class FolderDisplay {
  @Prop() onDelete: (folder: File) => void | undefined
  @Prop() items: File[]

  redirect = (file: File) => {
    window.open(file.webViewLink, '_blank')
  }

  handleRemovalClick(e: MouseEvent, file: File) {
    e.preventDefault()
    if (this.onDelete) {
      this.onDelete(file)
    }
  }

  render() {
    if (!this.items && !this.items.length) {
      return null
    }

    return this.items.map(folder => {
      return (
        <li class='list-item'>
          <div>
            {this.onDelete ? (
              <p>
                <strong>/{folder.name}</strong>
              </p>
            ) : (
              <p>
                Files will be saved in <strong>/{folder.name}</strong>
              </p>
            )}
            {this.onDelete && (
              <a
                class='remove-link'
                href='#'
                onClick={e => {
                  this.handleRemovalClick(e, folder)
                }}
              >
                Remove
              </a>
            )}
          </div>
          <div
            onClick={() => {
              this.redirect(folder)
            }}
            class='preview'
          >
            <IconView />
          </div>
        </li>
      )
    })
  }
}
