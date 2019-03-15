import {Component, Prop, State, t} from '@bearer/core'
import { NavigationItem } from '../types'

import IconNoResults from '../icons/icon-no-results'
import IconPath from '../icons/icon-path'

@Component({ tag: 'navigation-list', styleUrl: 'navigation-list.css' })
export class NavigationList {
  @Prop() items: NavigationItem[] = []
  @Prop() onSubmitted: any
  @Prop() onSaveClicked: any

    @State() selectedFolder: File;

  handleSubmit(selection: NavigationItem) {
    if (this.onSubmitted) {
      this.onSubmitted(selection)
    }
  }

  handleSave = (e: MouseEvent) => {
      e.preventDefault();
      this.onSaveClicked(this.selectedFolder)
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
          <span class='no-results-label'>{t('state.empty_results', 'No data found')}</span>
        </div>
      )
    }

    return (
        <form>
          <ul class='navigation-list'>
            {this.items.map(item => (
                <li
                    class='navigation-item'
                    onClick={() => {
                      this.handleSubmit(item)
                    }}
                >
                  <span class='label'>{item.name}</span>
                  <IconPath/>
                </li>
            ))}
          </ul>
            <div class='navigation-submit'>
                <bearer-button onClick={(event) => {this.handleSave(event)}}>Create here</bearer-button>
            </div>
        </form>
    )
  }

  render() {
    return <div class='scroll'>{this.renderContents()}</div>
  }
}
