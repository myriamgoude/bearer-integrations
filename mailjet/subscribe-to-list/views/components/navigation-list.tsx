import {Element, Component, Prop, State, t} from '@bearer/core'
import IconNoResults from '../icons/icon-no-results'
import { NavigationItem } from '../types'

@Component({ tag: 'navigation-list', styleUrl: 'navigation-list.css' })
export class NavigationList {
  @Prop() items: NavigationItem[] = []
  @Prop() onSubmitted: any
  @State() selection: any[] = [];
  @Element() el: HTMLElement

  handleSubmit = (e: MouseEvent) => {
    e.preventDefault()
    this.onSubmitted(this.selection);
      this.selection = [];
  }

  handleChange = (e: MouseEvent) => {
    e.preventDefault();
    if (e.currentTarget['checked']) {
        this.selection.push({id: e.currentTarget['data-value'].ID, name: e.currentTarget['data-value'].Name});
    } else {
        this.selection = this.selection.filter(item => item !== e.currentTarget['data-value'])
    }
  };

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
                <li class='navigation-item'>
                  <span class='label'>{item.Name}</span>
                  <input type='checkbox' name='selectedForm' class='bearer-radiobox' data-value={item} onChange={this.handleChange}/>
                </li>
            ))}
          </ul>
          <div class='navigation-submit'>
            <bearer-button onClick={this.handleSubmit}>Subscribe</bearer-button>
          </div>
        </form>
    )
  }

  render() {
    return <div class='scroll'>{this.renderContents()}</div>
  }
}
