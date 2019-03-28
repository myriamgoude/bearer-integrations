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
import {Calendar, GoogleEvent} from './types'

export type TAuthorizedPayload = { authId: string }

export enum InterfaceState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  Loading = 'Loading',
  Calendar = 'Calendar',
  Event = 'Event',
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Loading]: 'Loading...',
  [InterfaceState.Calendar]: 'Select a calendar',
  [InterfaceState.Event]: 'Create the event',
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

  @Intent('listCalendars') fetchCalendars: BearerFetch
  @Intent('createEvent') createEvent: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false
  @State() selectedCalendar: Calendar;

  @State() items: Calendar[] | undefined

  openPopoverOnceLoggedIn: boolean = false

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>

  @Event({ eventName: "created", bubbles: true })
  created: EventEmitter<GoogleEvent>;

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
      this.createEvent({ authId: this.authId, data: this.event, calendarId: this.calendarid}).then(({ data }: { data: GoogleEvent }) => {
        this.ui = InterfaceState.Authenticated;
        this.created.emit(data);
      }).catch(this.handleError)
    } else {
      this.ui = InterfaceState.Loading;
      this.listCalendars()
    }
  }

  listCalendars = () => {
    this.items = undefined
    this.errorMessage = undefined

    this.fetchCalendars({ authId: this.authId })
      .then(({ data }: { data: Calendar[] }) => {
        this.ui = InterfaceState.Calendar;
        this.items = data
      })
      .catch(this.handleError)
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleItemSelectìon = (selectedItem: Calendar) => {
      this.selectedCalendar = selectedItem;
      this.ui = InterfaceState.Event;
  }

  handleEventCreation = (data) => {
    this.createEvent({ authId: this.authId, data: JSON.stringify(data), calendarId: this.selectedCalendar.id}).then(({ data }: { data: GoogleEvent }) => {
      this.ui = InterfaceState.Authenticated;
      this.created.emit(data);
    }).catch(this.handleError)
  }

  handleWorkflowBack = () => {
    switch (this.ui) {
      case InterfaceState.Settings:
      case InterfaceState.Calendar:
        this.listCalendars()
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
      case InterfaceState.Event:
        this.ui = InterfaceState.Calendar;
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

    const heading = t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''
    const handleMenu = this.ui == InterfaceState.Settings ? undefined : this.handleMenu
    const handleBack = (this.ui === InterfaceState.Settings && this.handleWorkflowBack)  || (this.ui === InterfaceState.Event && this.handleWorkflowBack)

    return (
      <popover-screen
        ui={this.ui}
        calendarId={this.calendarid}
        authId={this.authId}
        heading={heading}
        errorMessage={this.errorMessage}
        items={this.items}
        handleBack={handleBack}
        handleClose={this.handleExternalClick}
        handleMenu={handleMenu}
        handlePopoverToggler={this.togglePopover}
        handleItemSelection={this.handleItemSelectìon}
        handleEventCreation={this.handleEventCreation}
        handleRetry={this.handleRetry}
      />
    )
  }

  handleExternalClick = (_e: Event) => {
    this.items = undefined
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
