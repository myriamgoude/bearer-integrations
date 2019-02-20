import { Component, Prop } from '@bearer/core'
import IconGoogleDrive from './icon-google-drive';

const style = {
  fontSize: '1em',
  lineHeight: '30px',
  backgroundColor: 'white',
  fontWeight: '500',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
}

@Component({
  tag: 'icon-button',
  styleUrl: './icon-button.css',
  shadow: true
})
export class IconButton {
  @Prop() text: string;

  render() {
    return (<bearer-button style={style} kind="embed">
      <span>
        <IconGoogleDrive />
        {this.text}
      </span>
    </bearer-button>)
  }
}
