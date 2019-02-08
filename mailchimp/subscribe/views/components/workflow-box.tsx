import { Component, Prop } from '@bearer/core'

@Component({
  tag: 'workflow-box',
  styleUrl: 'workflow-box.css',
  shadow: true
})

export class WorkflowBox {
  @Prop() onBack: ()=> void
  @Prop() onMenu: ()=> void | undefined
  @Prop() heading: string

  render() {
    return (
      <div class='wrapper'>
        <div class='title'>
          <span>{this.heading}</span>
            {(this.onMenu) ? <button class='menu' onClick={this.onMenu}>...</button> : null}
          </div>
          <slot />
      </div>
    )
  }
}