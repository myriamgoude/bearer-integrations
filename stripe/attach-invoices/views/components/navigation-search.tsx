import { Component, State, Prop, t } from '@bearer/core'
import InputSearchIcon from '../icons/icon-input-search'

const TIMEOUT_DURATION = 500

@Component({
  tag: 'navigation-search',
  styleUrl: 'navigation-search.css'
})
export class NavigationSearch {
  @State() query: string = ''
  @State() debouner: number

  @Prop() onSearchQuery: (query: string) => void

  searchHandler = (e: any) => {
    this.query = e.target.value
    clearTimeout(this.debouner)
    this.debouner = setTimeout(() => {
      this.onSearchQuery(this.query)
    }, TIMEOUT_DURATION) as any
  }

  render() {
    return (
      <div class='search-wrapper'>
        <span class='search-icon'>
          <InputSearchIcon />
        </span>
        <input
          class='search-input'
          type='text'
          onKeyUp={this.searchHandler}
          placeholder={t('state.search', 'Search user')}
          value={this.query}
        />
      </div>
    )
  }
}
