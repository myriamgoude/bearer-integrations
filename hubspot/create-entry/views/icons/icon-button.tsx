import { Component, Prop } from '@bearer/core'
import IconProvider from './icon-google'

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
          <IconProvider />
          {this.text}
        </span>
      </bearer-button>
    )
  }
}
