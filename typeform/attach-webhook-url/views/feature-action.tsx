/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import Bearer, {
  BearerFetch,
  Element,
  Intent,
  Events,
  Event,
  EventEmitter,
  Output,
  Prop,
  RootComponent,
  State,
  t
} from '@bearer/core'
import '@bearer/ui'
import { Forms } from './types'

import IconSettings from './icons/icon-settings'
import IconClose from './icons/icon-close'

export type TAuthorizedPayload = { authId: string }

export enum InterfaceState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  Loading = 'Loading',
  Forms = 'Forms',
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Loading]: 'Loading...',
  [InterfaceState.Forms]: 'Select a form',
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
  @Prop() webhookUrl: string

  @State() tag: string = 'bearer' // TODO - add a uniq tag (setupid ?)

  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch
  @Intent('attachWebhookUrl') attachWebhookUrl: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false
  @State() openPopoverOnceLoggedIn: boolean = false

  @State() formsData: Forms[] | undefined
  @State() selectedForm: Forms | undefined
  @State() formsSearchResults: Forms[] | undefined

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>

  @Output() forms: Forms[]

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
    this.selectedForm = undefined
    this.errorMessage = undefined
    this.ui = InterfaceState.Forms
    this.getData({ authId: this.authId })
      .then(({ data }: { data: Forms[] }) => {
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
      .then(({ data }: { data: Forms[] }) => {
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
      case InterfaceState.Settings:
        this.ui = InterfaceState.Forms
        break
      case InterfaceState.Forms:
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
    }
  }

  attachForm = (form: Forms) => {
    this.selectedForm = form
  }

  attachWebhook = (form: Forms) => {
    this.attachWebhookUrl({ formId: form.id, tag: this.tag, webhookUrl: this.webhookUrl })
      .then(() => {
        this.forms = [form]
        if (this.autoClose) {
          this.ui = InterfaceState.Authenticated
        }
      })
      .catch(this.handleError)
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  handleLogout = () => {
    // if(this.revoke){ this.revoke() }
    // this.revoke = undefined;
    this.ui = InterfaceState.Unauthenticated
  }

  renderUnauthorized: any = () => (
    <connect-action
      text-unauthenticated={t('btn.main_action', 'Create a webhook')}
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
      <bearer-popover opened={this.ui > InterfaceState.Authenticated}>
        <icon-button
          slot='popover-toggler'
          onClick={this.togglePopover}
          text={t('btn.main_action', 'Create a webhook')}
        />
        {this.renderWorkflow()}
      </bearer-popover>
    )
  }

  renderWorkflow = () => {
    if (this.ui <= InterfaceState.Authenticated) {
      return null
    }

    console.log(this.webhookUrl)
    if (!this.webhookUrl) {
      this.ui = InterfaceState.Error
      this.errorMessage = 'Webhook URL is not set'
    }

    const heading = t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''
    const subHeading = undefined
    const handleBack = this.ui === InterfaceState.Settings && this.handleWorkflowBack
    const handleClose = this.handleExternalClick
    const handleMenu = this.handleMenu

    return [
      <div slot='popover-header'>
        <div class='popover-header'>
          {handleBack && <icon-chevron class='popover-back-nav' direction='left' onClick={handleBack} />}
          <div class='popover-title'>
            <h3>{heading}</h3>
            {subHeading && <span class='popover-subtitle'>{subHeading}</span>}
          </div>
        </div>
        <div class='popover-controls'>
          {handleMenu && (
            <button class='popover-control' onClick={handleMenu}>
              <IconSettings />
            </button>
          )}
          {handleClose && (
            <button class='popover-control' onClick={handleClose}>
              <IconClose />
            </button>
          )}
        </div>
      </div>,
      <div style={{ width: '300px' }}>{this.renderWorkflowContent()}</div>
    ]
  }

  renderWorkflowContent = () => {
    switch (this.ui) {
      case InterfaceState.Error:
        return <error-message message={this.errorMessage} onRetry={this.handleRetry} />
      case InterfaceState.Settings:
        return <connect-action authId={this.authId} text-authenticated='Logout' icon='ios-log-out' />
      case InterfaceState.Forms:
        const options =
          this.formsSearchResults && this.formsSearchResults.length !== 0 ? this.formsSearchResults : this.formsData
        return (
          <div>
            <list-navigation
              items={options}
              attributeName={'title'}
              onSearchHandler={this.handleSearchQuery}
              onSubmitHandler={this.attachWebhook}
              showNextIcon={true}
            />
          </div>
        )
    }
    return null
  }

  handleExternalClick = (_e: Event) => {
    this.formsData = undefined
    this.selectedForm = undefined
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
