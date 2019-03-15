import { Component, Prop } from '@bearer/core'
import IconProvider from './icon-spreadsheets'
import IconGoogle from './icon-google-drive'

@Component({
  tag: 'icon-button',
  styleUrl: './icon-button.css',
  shadow: true
})
export class IconButton {
  @Prop() text: string;

  render() {
    return (
      <bearer-button kind='embed'>
        <span>
          {this.text.includes('Export') ? <IconProvider /> : <IconGoogle /> }
          {this.text}
        </span>
      </bearer-button>
    )
  }
}
