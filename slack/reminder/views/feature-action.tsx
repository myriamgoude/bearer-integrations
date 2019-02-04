import { 
  RootComponent, 
  State,
  Prop,
  BearerFetch, 
  Intent, 
  Element
} from '@bearer/core'
import '@bearer/ui'

enum InterfaceState {
  Unauthenticated,
  Authenticated,
  Create,
  Settings,
  Done,
  Error,
}

const SATE_TITLES = {
  [InterfaceState.Create]: 'Reminder for you',
  [InterfaceState.Settings]: 'Settings',
  [InterfaceState.Done]: 'Done!',
}

const REMINDED_AT_OPTIONS = [
  {
    value: 30, 
    label: '30 min'
  },
  {
    value: 60, 
    label: '1 hour'
  },
  {
    value: (60*2), 
    label: '2 hours'
  },
  {
    value: (60*24), 
    label: '1 day'
  }
] as { value:number, label:string }[]

interface CreationFormState {
  message: string,
  reminderAt: number,
}

const DEFAULT_FORM_STATE = {
  message: '',
  reminderAt: REMINDED_AT_OPTIONS[0].value,
} as CreationFormState


@RootComponent({
  group: 'feature',
  role: 'action',
})
export class FeatureAction {
  @Intent('createReminder') createReminder: BearerFetch
  @Intent('deleteReminder') deleteReminder: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage:string | undefined
  @State() revoke:any | undefined
  @State() form:CreationFormState = DEFAULT_FORM_STATE
  @State() disabled:boolean = true
  @State() reminderRef:string

  @Prop() timestamp:number 

  @Element() el: HTMLElement;

  handleRetry = () => {
    this.ui = InterfaceState.Authenticated
    //this.handleAttachClick()
  }

  handleShowCreate = () => {
    this.ui = InterfaceState.Create
  }

  handleWorkflowBack = () => {
    switch(this.ui){
      case InterfaceState.Done:
      case InterfaceState.Settings:
        this.ui = InterfaceState.Create
        break;
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break;
    }
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  onAuthorizeClick = (authenticate: () => Promise<boolean>) => {
    authenticate()
      .then(()=>{
        this.ui = InterfaceState.Authenticated
        this.handleShowCreate()
      })
      .catch(console.error)
  }

  handleLogout = () => {
    if(this.revoke){ this.revoke() }
    this.revoke = undefined
    this.ui = InterfaceState.Unauthenticated
  }

  renderUnauthoried: any = ({ authenticate }) => (
    <icon-button
      onClick={() => this.onAuthorizeClick(authenticate)}
      icon="logo-slack"
      text="Remind me on Sack"
    />
  )

  renderAuthorized: any = ({ revoke }:any) => {
    this.revoke = revoke
    return (
      <icon-button onClick={this.handleShowCreate} icon="logo-slack" text="Remind me on Sack" />
    )
  }

  renderWorkflow = () => {
    if(this.ui > InterfaceState.Authenticated){
      return (
        <workflow-box
        heading={SATE_TITLES[this.ui] || ""}
        subHeading={undefined}
        onBack={this.handleWorkflowBack}
        onCloseButton={this.handleExternalClick}
        onMenu={(this.ui == InterfaceState.Settings) ? undefined : this.handleMenu }
        style={{position: 'absolute', paddingLeft: '10px'}}
        >
          {this.renderWorkflowContent()}
        </workflow-box>
      )
    }
  }

  renderWorkflowContent = () => {
    switch(this.ui){
      case InterfaceState.Error:
        return <error-message
          message={this.errorMessage}
          onRetry={this.handleRetry}
        />
      case InterfaceState.Settings:
        // just use the same handler for all options as we just have logout
        return (
          <list-navigation
          options={[
            {name: 'Logout', icon: 'ios-log-out'}
          ]}
          attributeName={'name'}
          showNextIcon={false}
          onOptionClicked={this.handleLogout} />
        )
      case InterfaceState.Create:
          return this.renderForm()
      case InterfaceState.Done:
        return (<div class="donebox">
          <ion-icon class='check' name="checkmark"></ion-icon>
          <p>Reminder created for</p>
          <p class='date'>{(new Date(this.getReminderTime()*1000)).toString()}</p>
          <p><a href='#' onClick={this.handleDeleteReminder}>Cancel</a></p>
        </div>)
        
    }
    return null
  }

  handleExternalClick = (_e:Event) => {
    if(this.ui != InterfaceState.Unauthenticated){
      this.ui = InterfaceState.Authenticated
    }
  }
  
  handleInternalClick = (e:Event) => {
    e.stopImmediatePropagation()
  }

  handleCreateReminder = (e:Event) => {
    e.preventDefault()
    const when = this.getReminderTime()
    this.createReminder({when, what: this.form.message }).then(({data}) => {
      if(data.ok){
        this.reminderRef = data.reminder.id
      }
      console.log('createReminder data',data)
    })
    .catch(error => {
      console.log('createReminder error',error)
    })
    this.ui = InterfaceState.Done
  }

  handleDeleteReminder = (e:Event) => {
    e.preventDefault()
    this.deleteReminder({reminder: this.reminderRef})
    .then(({data}) => {
      console.log('deleteReminder', data)
      this.handleWorkflowBack()
    }).catch(error => {
      console.log('deleteReminder error',error)
    })
    
  }
  
  handleMessage = (e:any) => {
    this.form.message = e.target.value
    this.disabled = this.form.message === ''
  }
  handleReminderOffset = (e:any) => {
    this.form.reminderAt = parseInt(e.target.value)
  }

  componentDidLoad() {
    this.el.addEventListener("click", this.handleInternalClick);
    document.addEventListener("click", this.handleExternalClick);
  }

  render() {
    return (
      <div>
        <bearer-authorized
          renderUnauthorized={this.renderUnauthoried}
          renderAuthorized={this.renderAuthorized}
        />
        {this.renderWorkflow()}
      </div>
    )
  }

  renderForm = ()=> {
    return (
      <form onSubmit={this.handleCreateReminder}>
        <div class='row'>
          <label>Message</label>
          <input type="text" value={this.form.message} placeholder="your message" onInput={this.handleMessage} />
        </div>
        <div class='row'>
          <label>Remind me</label>
          <select onChange={this.handleReminderOffset}>
            {REMINDED_AT_OPTIONS.map((option) => {
              return <option 
                value={option.value}
                selected={option.value == this.form.reminderAt}
                >{option.label}</option>
            })}
          </select>
        </div>
        <button type="submit" class="saveButton" disabled={this.disabled}>
          Save
        </button>
      </form>
    )
  }

  getReminderTime = () => {
    // (event timestamp seconds since epoch) - ('before' time in minutes converted to seconds)
    return this.timestamp - (this.form.reminderAt * 60)
  }
}
