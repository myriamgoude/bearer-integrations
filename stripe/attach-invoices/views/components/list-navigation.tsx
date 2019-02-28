import {Component, Prop, State, Element} from '@bearer/core';
import IconNoResults from './icons/icon-no-results';
import { Customer } from "../types";

@Component({
  tag: 'list-navigation',
  shadow: true,
  styleUrl: 'list-navigation.css'
})

export class ListNavigation {
  @Prop() options: any[] | undefined;
  @Prop() attributeName: string | undefined;
  @Prop() showNextIcon: boolean = true;

  @Prop() formatLabel: (option: any) => JSX.Element;
  @Prop() onSearchQuery: (query: string) => void;
  @Prop() onSubmitted: (customer: Customer) => void;

  @Element() el: HTMLElement;
  @State() selection: Customer;

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

  randomWidthStyle(){
    const ammount = (Math.random()*150)+100;
    return { width: `${ammount}px` }
  };

  renderSearch() {
    return (this.onSearchQuery) ? <br-search onSearchQuery={this.onSearchQuery}/> : null
  };

  handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    
    const inputChecked = this.el.shadowRoot.querySelector("input[type=radio]:checked");
    // @ts-ignore (inputChecked.value is not ts-compliand)
    this.selection = { id: inputChecked.value, name: null };
    
    this.onSubmitted(this.selection);
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
          <div class="no-results-content">
            <div class="background">
              <IconNoResults />
            </div>
            <span class='no-results-label'>No data found</span>
          </div>
      )
    }
    
    return (
      <form>
        <ul>
        {this.options.map((data) => (
          <li>
            <label>
              <span class='label'>{this.getLabel(data)}</span>
              <input type="radio" name="selectedForm" class="bearer-radiobox" value={data.id}/>
            </label>
          </li>
        ))}
      </ul>
      <div style={{textAlign: "right"}}><bearer-button slot="popover-action" onClick={this.handleSubmit}>Select</bearer-button></div> 
      </form>
    )
  }
}
