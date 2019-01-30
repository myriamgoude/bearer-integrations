import { Component, State, Prop } from '@bearer/core'

const scrollStyle = {
  maxHeight: '300px',
  overflow: 'scroll',
  margin: '10px'
}

const listStyle = {
  listStyle: 'none',
  padding: '0',
}
const itemStyle = {
  lineHeight: '18px',
  display: 'flex',
  flex: '1',
  marginBottom: '10px',
  justifyContent: 'flex-end'
}
const labelStyle = {
  flex:'1',
}

const buttonStyle = {
  borderRadius: '4px',
  color: 'white',
  backgroundColor: '#0FE49B',
  fontSize: '1.1em',
  padding: '5px 25px',
  lineHeight: '30px',
  border: 'none',
} 

@Component({
  tag: 'list-select',
  shadow: true
})

export class ListSelect {
  @State() selected: { [key: string]: boolean }
  @Prop() options: any[] = []
  @Prop() selectedOptions: any[] = []
  @Prop() hideOptions: any[] = [] 
  @Prop() attributeName: string | undefined
  @Prop() attributeHash: string | undefined
  @Prop() onSave: (data:any[])=> void
  @Prop() search: boolean = false
  
  getName = (element:any) =>{
    if(this.attributeName){
      return element[this.attributeName]
    }else{
      return element
    }
  }
  getHash = (element:any) => {
    if(this.attributeHash){
      return element[this.attributeHash]
    }else{
      return this.getName(element)
    }
  }

  handleSubmit(e: Event) {
    e.preventDefault()
    this.onSave(
      this.options.filter((opt) => this.selected[this.getHash(opt)])
    )
  }

  handleChecked(option:string, checked:boolean){
    this.selected[this.getHash(option)] = checked    
  }

  componentWillLoad(){
    const searchKeys = this.selectedOptions.map((elm:any) => this.getHash(elm))
    this.selected = this.options.reduce((acc, option) => { 
        const hashKey= this.getHash(option)
        acc[hashKey] = searchKeys.indexOf(hashKey) != -1
        return acc 
    },{})
  }

  renderItems() {
    return (
      <ul style={listStyle}>
        {this.options.map((option)=>(
          <li style={itemStyle}>
          <span style={labelStyle}>{this.getName(option)}</span>
          <br-checkbox 
            onChecked={(e: Event) => this.handleChecked(option, (e.target as any).checked)}
            checked={(this.selected[this.getHash(option)])}
          />
          </li>
        ))}
      </ul>
    )
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        {(this.search) ? <br-search/> : null }
        <div style={scrollStyle}>
          {this.renderItems()}
        </div>
        <input type="submit" style={buttonStyle} value="Subscribe" />
      </form>
    )
  }
}