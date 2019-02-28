import { Component, Prop } from '@bearer/core'

@Component({
  tag: 'shadow-box',
  shadow: true,
  styleUrl: 'shadow-box.css'
})
export class ShadowBox {
  @Prop() styles: any = {}
  render() {
    return <div style={this.styles}>
      <slot></slot>
    </div>
  }
}
