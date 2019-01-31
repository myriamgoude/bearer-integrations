import { Component, Prop } from '@bearer/core'
import 'ionicons'

const style = {
  fontSize: '1em',
  lineHeight: '30px',
  backgroundColor: 'white',
  fontWeight: '500',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
}

const iconStyle = {
  paddingRight: '5px',
  marginBottom: '-2px',
  color: '#3E75C3',
  fontSize: '1.2em',
}

@Component({
  tag: 'icon-button',
  shadow: true
})
export class IconButton {
  @Prop() icon: string | undefined
  @Prop() text: string

  render() {
    return (<shadow-box>
      <button style={style}>
        {(this.icon) ? <ion-icon 
          name={this.icon}
          style={iconStyle}
        /> : null}
        {this.text}
      </button>
    </shadow-box>)
  }
}
