import {Component, Element, p, Prop, t} from '@bearer/core'

import IconSettings from '../icons/icon-settings'
import IconClose from '../icons/icon-close'
import {InterfaceState} from '../feature-action'

@Component({
  tag: 'popover-screen',
  styleUrl: 'popover-screen.css'
})
export class PopoverScreen {
  @Prop() ui: InterfaceState
  @Prop() authId: string
  @Prop() entry: any;
  @Prop() updateEntry: any;

  @Prop() heading: string
  @Prop() subHeading: string
  @Prop() errorMessage: string

  @Prop() handleClose: any
  @Prop() handleBack: any
  @Prop() handleMenu: any
  @Prop() handlePopoverToggler: any
  @Prop() handleEntryCreation: any
  @Prop() handleEntryUpdate: any
  @Prop() handleRetry: any

  @Element() el: HTMLElement

  onEventCreated = (...arg) => {
    this.handleEntryCreation(...arg)
  }

  onEventUpdated = () => {
    this.handleEntryUpdate();
  }

  renderNavigation = () => {
    switch (this.ui) {
      case InterfaceState.Loading:
        return <navigation-loader />

      case InterfaceState.Entry:
        return <navigation-create onSubmitted={this.onEventCreated} />

      case InterfaceState.Update:
        return <navigation-update updateEntry={this.updateEntry} entry={this.entry} onSubmitted={this.onEventUpdated} />

      case InterfaceState.Settings:
        return <connect-action authId={this.authId} text-authenticated={t('btn.logout', 'Logout')} icon='ios-log-out' />

      case InterfaceState.Error:
        return <navigation-error message={this.errorMessage} onRetry={this.handleRetry} />
    }
    return null
  }

  render() {
    return (
      <bearer-popover opened={this.ui > InterfaceState.Authenticated}>
        <icon-button
          slot='popover-toggler'
          onClick={this.handlePopoverToggler}
          text={p('btn.main_action', 0, 'Sync informations')}
        />
        <div slot='popover-header'>
          <div class='popover-header'>
            {this.handleBack && <icon-chevron class='popover-back-nav' direction='left' onClick={this.handleBack} />}
            <div class='popover-title'>
              <h3>{this.heading}</h3>
            </div>
          </div>
          <div class='popover-controls'>
            {this.handleMenu && (
              <button class='popover-control' onClick={this.handleMenu}>
                <IconSettings />
              </button>
            )}
            {this.handleClose && (
              <button class='popover-control' onClick={this.handleClose}>
                <IconClose />
              </button>
            )}
          </div>
        </div>
        <div class='popover-content'>{this.renderNavigation()}</div>
      </bearer-popover>
    )
  }
}
