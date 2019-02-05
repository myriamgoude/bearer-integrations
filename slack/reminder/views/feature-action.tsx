import { RootComponent, State, Prop, BearerFetch, Intent, Element, t } from '@bearer/core'
import '@bearer/ui'

enum InterfaceState {
  Unauthenticated,
  Authenticated,
  Create,
  Settings,
  Done,
  Error
}

const REMINDED_AT_OPTIONS: TimeOption[] = [
  {
    value: 30,
    key: 'times.30min',
    default: '30 min'
  },
  {
    value: 60,
    key: 'times.1hour',
    default: '1 hour'
  },
  {
    value: 60 * 2,
    key: 'times.2hours',
    default: '2 hours'
  },
  {
    value: 60 * 24,
    key: 'times.1day',
    default: '1 day'
  }
]

interface CreationFormState {
  message: string
  reminderAt: number
}

const DEFAULT_FORM_STATE = {
  message: '',
  reminderAt: REMINDED_AT_OPTIONS[0].value
} as CreationFormState

@RootComponent({
  group: 'feature',
  role: 'action'
})
export class FeatureAction {
  @Intent('createReminder') createReminder: BearerFetch
  @Intent('deleteReminder') deleteReminder: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() revoke: any | undefined
  @State() form: CreationFormState = DEFAULT_FORM_STATE
  @State() disabled: boolean = true
  @State() reminderRef: string

  @Prop() timestamp: number

  @Element() el: HTMLElement

  handleRetry = () => {
    this.ui = InterfaceState.Create

  }

  handleShowCreate = () => {
    this.ui = InterfaceState.Create
  }

  handleWorkflowBack = () => {
    switch (this.ui) {
      case InterfaceState.Done:
      case InterfaceState.Settings:
        this.ui = InterfaceState.Create
        break
      case InterfaceState.Authenticated:
        this.ui = InterfaceState.Unauthenticated
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
    }
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  handleError = (_error: any) => {
    this.ui = InterfaceState.Error
    this.errorMessage = t('errors.creationError', 'We could not create the reminder!')
  }

  onAuthorizeClick = (authenticate: () => Promise<boolean>) => {
    authenticate()
      .then(() => {
        this.ui = InterfaceState.Authenticated
        this.handleShowCreate()
      })
      .catch(this.handleError)
  }

  handleLogout = () => {
    if (this.revoke) {
      this.revoke()
    }
    this.revoke = undefined
    this.ui = InterfaceState.Unauthenticated
  }

  renderUnauthorized: any = ({ authenticate }) => (
    <icon-button
      onClick={() => this.onAuthorizeClick(authenticate)}
      icon="logo-slack"
      text={t('buttons.remindMe', 'Remind me on Slack')}
    />
  )

  handleAuthorized: any = ({ revoke }: any) => {
    this.revoke = revoke
  }

  renderAuthorized: any = () => {
    if (this.ui < InterfaceState.Authenticated) {
      return null;
    }

    return (
      <icon-button
        onClick={this.handleShowCreate}
        icon="logo-slack"
        text={t('buttons.remindMe', 'Remind me on Slack')}
        isPopover={true}
        isPopoverOpened={this.ui > InterfaceState.Authenticated}
      >
        {this.renderWorkflow()}
      </icon-button>
    )
  }

  renderWorkflow = () => {
    if (this.ui > InterfaceState.Authenticated) {
      const STATE_TITLES = {
        [InterfaceState.Create]: t('titles.create', 'Reminder for you'),
        [InterfaceState.Settings]: t('titles.settings', 'Settings'),
        [InterfaceState.Done]: t('titles.done', 'Done!')
      }
      return (
        <workflow-box
          heading={STATE_TITLES[this.ui] || ''}
          subHeading={undefined}
          onCloseButton={this.handleClosePopoverClick}
          onMenu={this.ui == InterfaceState.Settings ? undefined : this.handleMenu}
        >
          {this.renderWorkflowContent()}
        </workflow-box>
      )
    }
  }

  renderWorkflowContent = () => {
    switch (this.ui) {
      case InterfaceState.Error:
        return <error-message message={this.errorMessage} onRetry={this.handleRetry} />
      case InterfaceState.Settings:
        // just use the same handler for all options as we just have logout
        return (
          <list-navigation
            options={[{ name: t('links.logout', 'Logout'), icon: 'ios-log-out' }]}
            attributeName={'name'}
            showNextIcon={false}
            onOptionClicked={this.handleLogout}
          />
        )
      case InterfaceState.Create:
        return this.renderForm()
      case InterfaceState.Done:
        return (
          <div class="donebox">
            <ion-icon class="check" name="checkmark" />
            <p>
              <bearer-i18n key="messages.success" default="Reminder created for" />
            </p>
            <p class="date">{new Date(this.getReminderTime() * 1000).toString()}</p>
            <p>
              <a href="#" onClick={this.handleDeleteReminder}>
                <bearer-i18n key="buttons.cancel" default="Cancel" />
              </a>
            </p>
          </div>
        )
    }
    return null
  }

  handleClosePopoverClick = (_e: Event) => {
    if (this.ui != InterfaceState.Unauthenticated) {
      this.ui = InterfaceState.Authenticated
    }
  }

  handleCreateReminder = (e: Event) => {
    e.preventDefault()
    const when = this.getReminderTime()
    this.createReminder({ when, what: this.form.message })
      .then(({ data }) => {
        if (data.ok) {
          this.reminderRef = data.reminder.id
        }
        console.log('createReminder data', data)
      })
      .catch(this.handleError)
    this.ui = InterfaceState.Done
  }

  handleDeleteReminder = (e: Event) => {
    e.preventDefault()
    this.deleteReminder({ reminder: this.reminderRef })
      .then(({ data }) => {
        console.log('deleteReminder', data)
        this.handleWorkflowBack()
      })
      .catch(this.handleError)
  }

  handleMessage = (e: any) => {
    this.form.message = e.target.value
    this.disabled = this.form.message === ''
  }
  handleReminderOffset = (e: any) => {
    this.form.reminderAt = parseInt(e.target.value)
  }

  render() {
    return (
      <div>
        <bearer-authorized renderUnauthorized={this.renderUnauthorized} renderAuthorized={this.handleAuthorized} />
        {this.renderAuthorized()}
      </div>
    )
  }

  renderForm = () => {
    return (
      <form onSubmit={this.handleCreateReminder}>
        <div class="row">
          <label>Message</label>
          <input
            type="text"
            value={this.form.message}
            placeholder={t('inputs.placeholder', 'your message')}
            onInput={this.handleMessage}
          />
        </div>
        <div class="row">
          <label>Remind me</label>
          <select onChange={this.handleReminderOffset}>
            {REMINDED_AT_OPTIONS.map(option => {
              return (
                <option value={option.value} selected={option.value == this.form.reminderAt}>
                  {t(option.key, option.default)}
                </option>
              )
            })}
          </select>
        </div>
        <button type="submit" class="saveButton" disabled={this.disabled}>
          <bearer-i18n key="buttons.save" default="Save" />
        </button>
      </form>
    )
  }

  getReminderTime = () => {
    // (event timestamp seconds since epoch) - ('before' time in minutes converted to seconds)
    return this.timestamp - this.form.reminderAt * 60
  }
}

type TimeOption = { value: number; key: string; default: string }
