import { Component, State, Element, Prop, t } from '@bearer/core'
import { File } from '../types'

import IconNoResults from '../icons/icon-no-results'
import IconPath from '../icons/icon-path'

@Component({
  tag: 'list-navigation',
  shadow: true,
  styleUrl: 'list-navigation.css'
})
export class ListNavigation {
  @Prop() items: any[] | undefined
  @Prop() showNextIcon: boolean = true
  @Prop() attributeName: string | undefined

  @Prop() formatLabel: (option: any) => JSX.Element

  @Prop() onSearchHandler: (query: string) => void
  @Prop() onSelectHandler: (option: any) => void
  @Prop() onSubmitHandler: (option: any) => void
  @Prop() onBackHandler: (option: any) => void

  @Element() el: HTMLElement
  @State() selection: File

  getName = (element: any) => {
    if (this.attributeName) {
      return element[this.attributeName]
    }
    return element
  }

  getLabel = (element: any) => {
    if (this.formatLabel) {
      return this.formatLabel(element)
    }
    return this.getName(element)
  }

  getNextArrow = (item: File) => {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      return this.showNextIcon ? <IconPath /> : null
    }
  }

  renderSearch() {
    return this.onSearchHandler ? <navigation-search onSearchQuery={this.onSearchHandler} /> : null
  }

  handleSubmit = (e: MouseEvent) => {
    e.preventDefault()

    const inputChecked = this.el.shadowRoot.querySelector('input[type=radio]:checked')
    // @ts-ignore (inputChecked.value is not ts-compliant)
    this.selection = { id: inputChecked.value, name: null }

    this.onSubmitHandler(this.selection)
  }

  render() {
    return (
      <div>
        {this.renderSearch()}
        <div class='scroll'>{this.renderContents()}</div>
      </div>
    )
  }

  renderContents = () => {
    if (!this.items) {
      return <navigation-loader />
    }

    if (this.items.length == 0) {
      return (
        <div class='no-results-content'>
          <div class='no-results-icon'>
            <IconNoResults />
          </div>
          <h4 class='no-results-label'>{t('state.empty_results', 'No data found')}</h4>
          <bearer-button kind='secondary' onClick={this.onBackHandler}>
            {t('btn.go_back', 'Back')}
          </bearer-button>
        </div>
      )
    }
    return (
      <ul class='navigation-list'>
        {this.items.map(item => (
          <li
            class='navigation-item'
            onClick={() => {
              this.onSelectHandler(item)
            }}
          >
            <span class='label'>{this.getLabel(item)}</span>
            {this.getNextArrow(item)}
          </li>
        ))}
      </ul>
    )
  }
}
