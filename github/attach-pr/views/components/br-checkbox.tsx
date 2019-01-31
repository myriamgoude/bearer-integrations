import { Component, Prop } from '@bearer/core'

@Component({
  tag: 'br-checkbox',
  styleUrl: 'br-checkbox.css',
  shadow: true,
})
export class BrCheckbox {
  @Prop() onChecked: (e: Event) => void
  @Prop() checked: boolean

  render() {
    return (
      <div>
      <label class="check">
      <input type="checkbox" onChange={this.onChecked} checked={this.checked}/>
      <div class="box"></div>
      </label>
      </div>
    )
  }
}
