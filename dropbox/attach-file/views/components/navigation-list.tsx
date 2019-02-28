import { Component, Prop } from '@bearer/core'
import IconNoResults from './icons/icon-no-results'
import { File } from '../types'

@Component({ tag: 'navigation-list', styleUrl: 'navigation-list.css' })
export class NavigationList {
  @Prop() items: File[] = []
  @Prop() onSubmitted: any

  handleSubmit(selection: File) {
    if (this.onSubmitted) {
      this.onSubmitted(selection)
    }
  }

  renderContents() {
    if (!this.items) {
      return <navigation-loader />
    }

    if (this.items.length == 0) {
      return (
        <div class='no-results-content'>
          <div class='no-results-icon'>
            <IconNoResults />
          </div>
          <span class='no-results-label'>No data found</span>
        </div>
      )
    }

    return (
      <ul>
        {this.items.map(item => (
          <li
            onClick={() => {
              this.handleSubmit(item)
            }}
          >
            <span class='label'>{item.name}</span>
            {item['.tag'] === 'folder' && <icon-chevron direction='right' style={{ marginLeft: '20px' }} />}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    return <div class='scroll'>{this.renderContents()}</div>
  }
}
