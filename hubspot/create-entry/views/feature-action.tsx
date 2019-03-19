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
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Loading]: 'Loading...',
  [InterfaceState.Entry]: 'Create a new entry',
  [InterfaceState.Error]: 'Something went wrong',
  [InterfaceState.Settings]: 'Settings'
}

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
  @Prop() autoClose: boolean = true
  @Prop() authId: string
  @Prop() event: string
  @Prop() calendarid: string

  @Intent('createEntry') createEntry: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false

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

    if (this.event && this.calendarid) {
      this.createEntry({data: this.event, calendarId: this.calendarid}).then(({ data }: { data: any }) => {
        this.ui = InterfaceState.Authenticated;
        this.created.emit(data);
      }).catch(this.handleError)
    } else {
      this.ui = InterfaceState.Entry;
    }
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleEntryCreation = (data) => {
    this.createEntry({data: JSON.stringify(data.body), type: data.type}).then(({ data }: { data: any }) => {
      this.ui = InterfaceState.Authenticated;
      this.created.emit(data);
    }).catch(this.handleError)
  }

  handleWorkflowBack = () => {
    switch (this.ui) {
      case InterfaceState.Settings:
        this.ui = InterfaceState.Entry;
        break
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
      text-unauthenticated={p('btn.main_action', 0, 'Create event')}
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

    return (
      <popover-screen
        ui={this.ui}
        calendarId={this.calendarid}
        authId={this.authId}
        heading={t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''}
        errorMessage={this.errorMessage}
        handleBack={this.handleWorkflowBack}
        handleClose={this.handleExternalClick}
        handleMenu={this.ui == InterfaceState.Settings ? undefined : this.handleMenu}
        handlePopoverToggler={this.togglePopover}
        handleEntryCreation={this.handleEntryCreation}
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
