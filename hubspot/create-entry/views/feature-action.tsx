import Bearer, {
  BearerFetch,
  Element,
  Event,
  Events,
  EventEmitter,
  Intent,
  Prop,
  RootComponent,
  State,
  t,
  p
} from '@bearer/core'
import '@bearer/ui'

export type TAuthorizedPayload = { authId: string }

export enum InterfaceState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  Loading = 'Loading',
  Entry = 'Entry',
  Update = 'Update',
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Loading]: 'Loading...',
  [InterfaceState.Entry]: 'Create a new entry',
  [InterfaceState.Error]: 'Something went wrong',
  [InterfaceState.Settings]: 'Settings',
  [InterfaceState.Update]: 'Update entry'
}

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
  @Prop() autoClose: boolean = true
  @Prop() authId: string
  @Prop() updateentry: string
  @Prop() entryid: string

  @Intent('createEntry') createEntry: BearerFetch
  @Intent('fetchEntry') fetchEntry: BearerFetch
  @Intent('updateEntry') updateEntry: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false
  @State() entry;
  @State() updatedEntry;

  openPopoverOnceLoggedIn: boolean = false

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>

  @Event({ eventName: "created", bubbles: true })
  created: EventEmitter<any>;

  @Element() el: HTMLElement

  handleRetry = () => {
    this.ui = InterfaceState.Authenticated
    this.togglePopover()
  }

  togglePopover = () => {
    if (this.ui > InterfaceState.Authenticated) {
      this.ui = InterfaceState.Authenticated
      return
    }

    if (this.updateentry && this.entryid) {
      const entry = JSON.parse(this.updateentry);
      this.updatedEntry = entry;
      this.fetchEntry({id: this.entryid, type: entry.type}).then(({ data }: { data: any }) => {
        this.entry = data;
        this.ui = InterfaceState.Update;
      }).catch(this.handleError)
    } else {
      this.ui = InterfaceState.Entry;
    }
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleEntryCreation = (entry) => {
    this.createEntry({data: JSON.stringify(entry.body), type: entry.type}).then(({ data }: { data: any }) => {
      this.ui = InterfaceState.Authenticated;
      this.created.emit({data, type: entry.type});
    }).catch(this.handleError)
  }

  handleEntryUpdate = () => {
    this.updateEntry({id: this.entryid, data: JSON.stringify(this.updatedEntry)}).then(({ data }: { data: any }) => {
      this.ui = InterfaceState.Authenticated;
      this.created.emit({data, type: this.updatedEntry.type, updated: true});
    }).catch(this.handleError)
  }

  handleWorkflowBack = () => {
    switch (this.ui) {
      case InterfaceState.Settings:
        this.ui = InterfaceState.Entry;
        break;
      case InterfaceState.Error:
      case InterfaceState.Entry:
        this.ui = InterfaceState.Authenticated;
        break
    }
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  renderUnauthorized: any = () => (
    <connect-action
      text-unauthenticated={p('btn.main_action', 0, 'Sync informations')}
      onClick={() => {
        this.openPopoverOnceLoggedIn = true
      }}
    />
  )

  renderAuthorized: any = () => {
    if (this.openPopoverOnceLoggedIn) {
      this.openPopoverOnceLoggedIn = false
      this.togglePopover()
    }

    const heading = t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''
    const handleMenu = this.ui == InterfaceState.Settings ? undefined : this.handleMenu
    const handleBack = this.ui === InterfaceState.Settings && this.handleWorkflowBack

    return (
      <popover-screen
        ui={this.ui}
        entry={this.entry}
        updateEntry={this.updatedEntry}
        authId={this.authId}
        heading={heading}
        errorMessage={this.errorMessage}
        handleBack={handleBack}
        handleClose={this.handleExternalClick}
        handleMenu={handleMenu}
        handlePopoverToggler={this.togglePopover}
        handleEntryCreation={this.handleEntryCreation}
        handleEntryUpdate={this.handleEntryUpdate}
        handleRetry={this.handleRetry}
      />
    )
  }

  handleExternalClick = (_e: Event) => {
    if (this.ui != InterfaceState.Unauthenticated) {
      this.ui = InterfaceState.Authenticated
    }
  }

  handleInternalClick = (e: Event) => {
    e.stopImmediatePropagation()
  }

  componentDidLoad() {
    this.el.addEventListener('click', this.handleInternalClick)
    document.addEventListener('click', this.handleExternalClick)

    Bearer.emitter.addListener(Events.AUTHORIZED, () => {
      this.isAuthorized = true
      if (this.ui < InterfaceState.Authenticated) {
        this.ui = InterfaceState.Authenticated
      }
    })

    Bearer.emitter.addListener(Events.REVOKED, () => {
      this.isAuthorized = false
      this.ui = InterfaceState.Unauthenticated
    })
  }

  render() {
    return this.isAuthorized ? this.renderAuthorized() : this.renderUnauthorized()
  }
}
