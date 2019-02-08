import { Component, Prop } from '@bearer/core'
import 'ionicons'
import GoogleDrive from './google-drive-logo'


const style = {
  fontSize: '1em',
  lineHeight: '30px',
  backgroundColor: 'white',
  fontWeight: '500',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
};

@Component({
  tag: 'icon-button',
  shadow: true
})
export class IconButton {
  @Prop() text: string

  render() {
    return (<shadow-box>
      <GoogleDrive />
      <button style={style}>
        {this.text}
      </button>
    </shadow-box>)
  }
}
