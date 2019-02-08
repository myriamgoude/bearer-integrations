import { Component, Prop } from '@bearer/core'

@Component({
  tag: 'workflow-box',
  styleUrl: 'workflow-box.css',
  shadow: true
})

export class WorkflowBox {
  @Prop() onBack: ()=> void;
  @Prop() onMenu: ()=> void | undefined;
  @Prop() onClose: (e:Event) => void | undefined;
  @Prop() heading: string;
  @Prop() subHeading: string | undefined;

  render() {
    return (
        <div class='wrapper'>
          <shadow-box styles={{position:'absolute', padding: '15px'}}>
            <div>
              <div class='title'>
              <button onClick={this.onBack} class='back'>
                  <icon-chevron direction="left"></icon-chevron>
                </button>
                <div style={{flex:'1', marginLeft:'10px'}}>
                  <span>{this.heading}</span>
                  <span style={{fontSize: '10px', display: 'block', lineHeight:'6px'}}>{this.subHeading}</span>
                </div>
                {(this.onMenu) ? <button class='menu' onClick={this.onMenu}>...</button> : null}
                {(this.onClose) ? <button style={{height: '25px'}} class='menu' onClick={this.onClose}><ion-icon name="close"></ion-icon></button> : null}
              </div>
              <slot />
            </div>
          </shadow-box>
        </div>
    )
  }
}
