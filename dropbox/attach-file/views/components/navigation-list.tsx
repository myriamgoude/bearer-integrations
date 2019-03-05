import { Component, Prop, t } from '@bearer/core'
import IconNoResults from '../icons/icon-no-results'
import IconPath from '../icons/icon-path'
import { NavigationItem } from '../types'

@Component({ tag: 'navigation-list', styleUrl: 'navigation-list.css' })
export class NavigationList {
  @Prop() items: NavigationItem[] = []
  @Prop() onSubmitted: any

  handleSubmit(selection: NavigationItem) {
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
          <span class='no-results-label'>{t('state.no_data', 'No data found')}</span>
        </div>
      )
    }

    return (
      <ul class='navigation-list'>
        {this.items.map(item => (
          <li
            class='navigation-item'
            onClick={() => {
              this.handleSubmit(item)
            }}
          >
            <span class='label'>{item.name}</span>
            {item['.tag'] === 'folder' && <IconPath />}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    return <div class='scroll'>{this.renderContents()}</div>
  }
}
