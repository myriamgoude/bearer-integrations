import { Component, Prop } from '@bearer/core'

@Component({
  tag: 'icon-chevron',
  styleUrl: 'icon-chevron.css',
  shadow: true,
})
export class IconChevron {
  @Prop() direction: string

  render() {
    return <span class={this.direction}></span>
  }
}