import { Component, Prop } from '@bearer/core'
import 'ionicons'
import GoogleDrive from './google-drive-logo'

const style = {
  fontSize: '0.875em',
  backgroundColor: 'white',
  fontWeight: '500',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '8px 10px 8px 25px'
};

@Component({
  tag: 'icon-button',
  styleUrl: './icon-button.css',
  shadow: true
})
export class IconButton {
  @Prop() text: string;

  render() {
    return (<shadow-box>
      <GoogleDrive />
      <button style={style}>
        {this.text}
      </button>
    </shadow-box>)
  }
}
