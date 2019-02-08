import { Component, State, Prop } from '@bearer/core'

@Component({
  tag: 'list-select',
  styleUrl: 'list-select.css',
  shadow: true
})

export class ListSelect {
  @State() selected: { [key: string]: boolean } = {}
  @Prop() options: any[] | undefined
  @Prop({mutable: true}) selectedOptions: any[] = []
  @Prop() hideOptions: any[] = [] 
  @Prop() attributeName: string | undefined
  @Prop() attributeHash: string | undefined
  @Prop() handleSubmit: (data:any[])=> void
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

  onSubmit = (e: Event) => {
    e.preventDefault()
    this.handleSubmit(
      this.options.filter((opt) => this.selected[this.getHash(opt)])
    )
    this.selected = {}
    this.selectedOptions = []
  }

  handleChecked(option:string, checked:boolean){
    this.selected[this.getHash(option)] = checked    
  }

  componentWillLoad(){
    const searchKeys = this.selectedOptions.map((elm:any) => this.getHash(elm))
    const options = this.options || []
    this.selected = options.reduce((acc, option) => { 
        const hashKey= this.getHash(option)
        acc[hashKey] = searchKeys.indexOf(hashKey) != -1
        return acc 
    },{})
  }

  renderItems = (options: any[] | undefined) => {
    if(options == undefined){
      return (
        <ul>
          {Array(4).fill(true).map(()=>(<li class="loading" style={this.randomWidthStyle()}></li>))}
        </ul>
      )
    }

    if(options.length == 0){
      return (
          <ul>
            <span class='label'>No Results</span>
          </ul>
      )
    }

    return (
      <ul>
        {options.map((option)=>(
          <li>
          <span class="label">{this.getName(option)}</span>
          <br-checkbox class="checkbox"
            onChecked={(e: Event) => this.handleChecked(option, (e.target as any).checked)}
            checked={(this.selected[this.getHash(option)])}
          />
          </li>
        ))}
      </ul>
    )
  }

  randomWidthStyle(){
    const amount = (Math.random()*150)+100
    return { width: `${amount}px` }
  }

  render() {
    return (
      <form>
        {(this.search) ? <br-search/> : null }
        <div class="list">
          {this.renderItems(this.options)}
        </div>
        <bearer-button onClick={this.onSubmit}>Subscribe</bearer-button>
      </form>
    )
  }
}