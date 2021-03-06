import { Component, Prop, State, Element, t } from '@bearer/core'
import { Customer } from '../types'

import IconNoResults from '../icons/icon-no-results'

@Component({
  tag: 'navigation-list',
  shadow: true,
  styleUrl: 'navigation-list.css'
})
export class NavigationList {
  @Prop() items: any[] | undefined
  @Prop() showNextIcon: boolean = true

  @Prop() formatLabel: (option: any) => JSX.Element
  @Prop() testSubtitle: string | undefined

  @Prop() onSearchHandler: (query: string) => void
  @Prop() onSelectHandler: (option: any) => void
  @Prop() onSubmitHandler: (option: any) => void
  @Prop() onBackHandler: (option: any) => void

  @Element() el: HTMLElement
  @State() selection: Customer

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
        </div>
      )
    }

    return (
      <form>
        <ul class='navigation-list'>
          {this.items.map(item => (
            <li class='navigation-item'>
              <label>
                <div class="display-type">
                <span class='label'>{item.email}</span>
                <span class='label-subtitle'>{this.testSubtitle}</span>
                </div>
              <div>
                <input type='radio' name='selectedForm' class='bearer-radiobox' value={item.id} />
              </div>
              </label>
            </li>
          ))}
        </ul>
        <div class='navigation-submit'>
          <bearer-button onClick={this.handleSubmit}>Select</bearer-button>
        </div>
      </form>
    )
  }
}
