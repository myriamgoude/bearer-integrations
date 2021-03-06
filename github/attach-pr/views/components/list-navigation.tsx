import { Component, Prop } from '@bearer/core'
import 'ionicons'

const iconStyle ={
  alignSelf: 'center',
  marginRight: '10px',
  fontSize: '1.2em',
}

@Component({
  tag: 'list-navigation',
  shadow: true,
  styleUrl: 'list-navigation.css'
})

export class ListNavigation {
  @Prop() options: any[] | undefined
  @Prop() disabledOptions: any[] | undefined
  @Prop() onOptionClicked: (option: any) => void
  @Prop() attributeName: string | undefined
  @Prop() attributeId: string | undefined
  @Prop() formatLabel: (option: any) => JSX.Element
  @Prop() onSearchQuery: (query: string) => void
  @Prop() showNextIcon: boolean = true

  getName = (element:any) =>{
    if(this.attributeName){
      return element[this.attributeName]
    }
    return element
  }

  getId = (element:any) => {
    if(this.attributeId){
      return element[this.attributeId]
    }
    return element
  }

  getIsDisabled = (element:any) => {
    if(this.disabledOptions){
      return this.disabledOptions.map(this.getId).indexOf(this.getId(element)) !== -1
    }
    return false
    
  }

  getLabel = (element: any) => {
    if(this.formatLabel){
      return this.formatLabel(element);
    }
    return this.getName(element)
  }

  getIcon = (element: any) => {
    if(element.icon){
      return <ion-icon name={element.icon} style={iconStyle} />
    }
    return null
  }

  getNextArrow = () => {
    return (this.showNextIcon) ? <icon-chevron direction='right' style={{marginLeft:'20px'}} /> : null
  }

  randomWidthStyle(){
    const ammount = (Math.random()*150)+100
    return { width: `${ammount}px` }
  }
  renderSearch() {
    return (this.onSearchQuery) ? <br-search onSearchQuery={this.onSearchQuery}/> : null
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
  }

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
          <ul>
            <span class='label'>No Results</span>
          </ul>
      )
    }

    return (
      <ul>
        {this.options.map((data) => {
          const isDisabled = this.getIsDisabled(data)
          return (
            <li onClick={()=>{(isDisabled)? null : this.onOptionClicked(data)}} class={`${(isDisabled) ? 'disabledRow' : ''}`}>
            {this.getIcon(data)}
            <span class='label'>{this.getLabel(data)}</span>
            {this.getNextArrow()}
            </li>
          )
        })}
      </ul>
    )
  }
}