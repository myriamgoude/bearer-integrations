import { Component, Prop } from '@bearer/core'
import IconClose from './icon-close';
import IconSettings from './icon-settings';

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

  renderFooter = () => {
    return (
        <div>
          <p class="footer-text">Powered by <strong>Bearer.sh</strong></p>
        </div>
    )
  };

  render() {
    return (
        <div class='wrapper'>
          <shadow-box styles={{position:'absolute', padding: '8px 32px'}}>
            <div style={{margin: '8px 0 32px'}}>
              <div class="settings">
                {(this.onMenu) ? <button class='menu' onClick={this.onMenu}><IconSettings /></button> : null}
                {(this.onClose) ? <button class='menu' onClick={this.onClose}><IconClose /></button> : null}
              </div>
              <div class='title'>
              <button onClick={this.onBack} class='back'>
                  <icon-chevron direction="left"></icon-chevron>
                </button>
                <div style={{flex:'1'}}>
                  <span style={{fontSize: '16px', fontFamily: 'Arial', lineHeight:'19px', fontWeight: 'bold', color: '#030D36'}}>{this.heading}</span>
                  <span style={{fontSize: '12px', fontFamily: 'Arial', display: 'block', lineHeight:'14px', fontWeight: 'normal', color: '#030D36'}}>{this.subHeading}</span>
                </div>
              </div>
              <slot />
            </div>
            {this.renderFooter()}
          </shadow-box>
        </div>
    )
  }
}
