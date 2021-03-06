import { Component, Prop } from '@bearer/core'

@Component({
  tag: 'workflow-box',
  styleUrl: 'workflow-box.css',
  shadow: true
})

export class WorkflowBox {
  @Prop() onBack: ()=> void
  @Prop() onMenu: ()=> void | undefined
  @Prop() onCloseButton: (e:Event) => void | undefined
  @Prop() heading: string
  @Prop() subHeading: string | undefined

  render() {
    return (
      <div class='wrapper'>
          <div>
            <div class='title'>
              {this.onBack && <button onClick={this.onBack} class='back'><icon-chevron direction="left"></icon-chevron></button>} 
              <div style={{flex:'1', marginLeft:'10px'}}>
                <span>{this.heading}</span>
                <span style={{fontSize: '10px', display: 'block', lineHeight:'6px'}}>{this.subHeading}</span>
              </div>
              <div class="menu">
                {(this.onMenu) && <button onClick={this.onMenu}>...</button>}
                {(this.onCloseButton) && <button style={{height: '25px'}} onClick={this.onCloseButton}><ion-icon name="close"></ion-icon></button>}
              </div>
            </div>
            <slot />
          </div>
      </div>
    )
  }
}