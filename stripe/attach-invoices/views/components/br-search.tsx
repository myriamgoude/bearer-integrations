import { Component, State, Prop } from '@bearer/core'
import InputSearchIcon from '../icons/icon-search'

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
        <span class='br-search-icon'>
          <InputSearchIcon />
        </span>
        <input
          class='br-search-input'
          type='text'
          onKeyUp={this.searchHandler}
          placeholder='Search user'
          value={this.query}
        />
      </div>
    )
  }
}
