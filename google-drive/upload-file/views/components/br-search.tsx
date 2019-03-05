import { Component, State, Prop } from '@bearer/core'
import IconSearch from '../icons/icon-search'
import 'ionicons'

const TIMEOUT_DURATION = 500

@Component({
  tag: 'br-search',
  styleUrl: 'br-search.css'
})
export class BrSearch {
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
      <div class='br-search-wrapper'>
        <IconSearch />
        <input
          class='br-search'
          type='text'
          onKeyUp={this.searchHandler}
          placeholder='Search folder'
          value={this.query}
        />
      </div>
    )
  }
}
