/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import Bearer, {
  BearerFetch,
  Element,
  Event,
  Events,
  EventEmitter,
  Intent,
  Output,
  Prop,
  RootComponent,
  State,
  t
} from '@bearer/core'
import '@bearer/ui'
import { Customer } from './types'

// import IconSettings from './icons/icon-settings'
// import IconClose from './icons/icon-close'

export type TAuthorizedPayload = { authId: string }

export enum InterfaceState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  Loading = 'Loading',
  Users = 'Users',
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Loading]: 'Loading...',
  [InterfaceState.Users]: 'Select User',
  [InterfaceState.Error]: 'Select User',
  [InterfaceState.Settings]: 'Settings'
}

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
  @Prop() autoClose: boolean = true
  @Prop() authId: string
  @Prop() customerid: string

  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false
  @State() openPopoverOnceLoggedIn: boolean = false

  @State() formsData: Customer[] | undefined
  @State() selectedCustomer: Customer | undefined
  @State() formsSearchResults: Customer[] | undefined

  @Output() invoices: any[]

  @Element() el: HTMLElement

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>
  @Event() attachedCustomer: EventEmitter

  handleRetry = () => {
    this.ui = InterfaceState.Authenticated
    this.handleAttachClick()
  }

  handleAttachClick = () => {
    if (this.ui > InterfaceState.Authenticated) {
      this.ui = InterfaceState.Authenticated
      return
    }
    this.selectedCustomer = undefined
    this.errorMessage = undefined
    this.ui = InterfaceState.Users
    this.getData({ authId: this.authId })
      .then(({ data }: { data: Customer[] }) => {
        this.formsData = data
      })
      .catch(this.handleError)
  }

  handleSearchQuery = (query: string) => {
    this.formsData = undefined
    this.formsSearchResults = undefined
    const req =
      query.length > 3 ? this.searchData({ authId: this.authId, query }) : this.getData({ authId: this.authId })
    req
      .then(({ data }: { data: Customer[] }) => {
        this.formsSearchResults = data
      })
      .catch(this.handleError)
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleWorkflowBack = () => {
    switch (this.ui) {
      case InterfaceState.Users:
        break
      case InterfaceState.Settings:
        this.ui = InterfaceState.Users
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
    }
  }

  attachCustomer = (customer: Customer) => {
    this.attachedCustomer.emit({ customer })

    this.selectedCustomer = customer
    this.ui = InterfaceState.Authenticated
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  handleLogout = () => {
    this.ui = InterfaceState.Unauthenticated
  }

  renderUnauthorized: any = () => (
    <connect-action
      text-unauthenticated={t('btn.main_action', 'Get invoices')}
      onClick={() => {
        this.openPopoverOnceLoggedIn = true
      }}
    />
  )

  renderAuthorized: any = () => {
    if (this.openPopoverOnceLoggedIn) {
      this.openPopoverOnceLoggedIn = false
      this.handleAttachClick()
    }

    const heading = t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''
    // const subHeading = undefined
    const handleBack = this.ui === InterfaceState.Settings && this.handleWorkflowBack
    const handleClose = this.handleExternalClick
    const handleMenu = this.ui == InterfaceState.Settings ? undefined : this.handleMenu

    return (
        <popover-screen
            ui={this.ui}
            authId={this.authId}
            heading={heading}
            errorMessage={this.errorMessage}
            items={this.formsData}
            handleSearchQuery={this.handleSearchQuery}
            handleBack={handleBack}
            handleClose={handleClose}
            handleMenu={handleMenu}
            handlePopoverToggler={this.handleAttachClick}
            handleItemSelection={this.attachCustomer}
            handleRetry={this.handleRetry}
        />
    )
  }

  handleExternalClick = (_e: Event) => {
    this.formsData = undefined
    this.selectedCustomer = undefined
    this.formsSearchResults = undefined
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
