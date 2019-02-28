import { BearerFetch, Component, Intent, Prop } from '@bearer/core'
import { File } from '../types'
import ViewIcon from './icons/icon-view'

@Component({
  tag: 'file-display',
  styleUrl: 'file-display.css',
  shadow: true
})
export class FileDisplay {
  @Intent('getPreviewLink') getPreviewLink: BearerFetch
  @Prop() onDelete: (file: File) => void | undefined
  @Prop() items: File[]

  redirect = (file: File) => {
    this.getPreviewLink({ fileId: file.id })
      .then(({ data }) => {
        window.open(`${data.link}`, '_blank')
      })
      .catch(err => {
        console.log(err.error)
      })
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

    return this.items.map(file => {
      return (
        <li class='list-item'>
          <div>
            <p>
              <strong>{file.name}</strong>{' '}
              {file.size ? <span class='file-size'>{(Number(file.size) / 1000000).toFixed(2)} Mo</span> : null}
            </p>
            {this.onDelete && (
              <a
                class='remove-link'
                href='#'
                onClick={e => {
                  this.handleRemovalClick(e, file)
                }}
              >
                Remove
              </a>
            )}
          </div>
          <div
            onClick={() => {
              this.redirect(file)
            }}
            class='preview'
          >
            <ViewIcon />
          </div>
        </li>
      )
    })
  }
}
