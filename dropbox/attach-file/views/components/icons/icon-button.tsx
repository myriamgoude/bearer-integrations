import { Component, Prop } from '@bearer/core'
import IconStripe from './icon-dropbox'

@Component({
  tag: 'icon-button',
  styleUrl: './icon-button.css',
  shadow: true
})
export class IconButton {
  @Prop() text: string

  render() {
    return (
      <bearer-button kind='embed'>
        <span>
          <IconStripe />
          {this.text}
        </span>
      </bearer-button>
    )
  }
}
