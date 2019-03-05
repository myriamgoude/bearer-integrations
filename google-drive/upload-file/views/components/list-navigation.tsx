import { Component, Prop, t } from '@bearer/core'
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

  getNextArrow = () => {
    return this.showNextIcon ? <IconPath /> : null
  }

  renderSearch() {
    return this.onSearchHandler ? <navigation-search onSearchQuery={this.onSearchHandler} /> : null
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
          <h4 class='no-results-label'>{t('state.empty_results', 'This is final destination')}</h4>
          <div class='navigation-submit'>
            <bearer-button onClick={this.onSubmitHandler}>Save here</bearer-button>
          </div>
        </div>
      )
    }
    return (
      <div>
        <ul class='navigation-list'>
          {this.items.map(item => (
            <li
              class='navigation-item'
              onClick={() => {
                this.onSelectHandler(item)
              }}
            >
              <span class='label'>{this.getLabel(item)}</span>
              {this.getNextArrow()}
            </li>
          ))}
        </ul>

        <div class='navigation-submit'>
          <bearer-button onClick={this.onSubmitHandler}>Save here</bearer-button>
        </div>
      </div>
    )
  }
}
