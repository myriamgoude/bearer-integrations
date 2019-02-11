import { Component, Prop } from '@bearer/core'
import 'ionicons'
import {File} from '../types'

const iconStyle ={
  alignSelf: 'center',
  marginRight: '10px',
  fontSize: '1.2em',
};

@Component({
  tag: 'list-navigation',
  shadow: true,
  styleUrl: 'list-navigation.css'
})

export class ListNavigation {
  @Prop() options: any[] | undefined;
  @Prop() selectedFolder: File | undefined;
  @Prop() onOptionClicked: (option: any) => void;
  @Prop() onSaveClicked: (option: any) => void;
  @Prop() attributeName: string | undefined;
  @Prop() formatLabel: (option: any) => JSX.Element;
  @Prop() onSearchQuery: (query: string) => void;
  @Prop() showNextIcon: boolean = true;

  getName = (element:any) =>{
    if(this.attributeName){
      return element[this.attributeName]
    }
    return element
  };

  getLabel = (element: any) => {
    if(this.formatLabel){
      return this.formatLabel(element);
    }
    return this.getName(element)
  };

  getIcon = (element: any) => {
    if(element.icon){
      return <ion-icon name={element.icon} style={iconStyle} />
    }
    return null
  };

  getNextArrow = () => {
    return (this.showNextIcon) ? <icon-chevron direction='right' style={{marginLeft:'20px'}} /> : null
  };

  randomWidthStyle(){
    const ammount = (Math.random()*150)+100;
    return { width: `${ammount}px` }
  };

  renderSearch() {
    return (this.onSearchQuery) ? <br-search onSearchQuery={this.onSearchQuery}/> : null
  };

  renderSaveButton() {
    return (this.showNextIcon) ? <button class="save-button" onClick={() => this.onSaveClicked(this.selectedFolder)}>Save here</button> : null;
  }

  render() {
    return (
      <div>
        {this.renderSearch()}
        <div class='scroll'>
            {this.renderContents()}
        </div>
      </div>
    )
  };

  renderContents = () => {
    if(this.options == undefined){
      return (
        <ul>
          {Array(4).fill(true).map(()=>(<li class="loading" style={this.randomWidthStyle()}></li>))}
        </ul>
      )
    }
    if(this.options.length == 0){
      return (
          <div>
            <ul>
              <span class='label'>No Results</span>
            </ul>
            <button class="save-button" onClick={() => this.onSaveClicked(this.selectedFolder)}>Save here</button>
          </div>
      )
    }
    return (
        <div>
          <ul>
            {this.options.map((data) => (
                <li onClick={() => {
                  this.onOptionClicked(data)
                }}>
                  {this.getIcon(data)}
                  <span class='label'>{this.getLabel(data)}</span>
                  {this.getNextArrow()}
                </li>
            ))}
          </ul>
          {this.renderSaveButton()}
        </div>
    )
  }
}
