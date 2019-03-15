import { Element, Component, Prop, t, p } from '@bearer/core'

import IconSettings from '../icons/icon-settings'
import IconClose from '../icons/icon-close'
import { InterfaceState } from '../feature-action'
import { NavigationItem } from '../types'

@Component({
  tag: 'popover-screen',
  styleUrl: 'popover-screen.css'
})
export class PopoverScreen {
  @Prop() ui: InterfaceState
  @Prop() authId: string
  @Prop() multi: boolean = false

  @Prop() heading: string
  @Prop() errorMessage: string

  @Prop() items: NavigationItem[]
  @Prop() handleClose: any
  @Prop() handleBack: any
  @Prop() handleMenu: any
  @Prop() handleSearchQuery: any
  @Prop() handlePopoverToggler: any
  @Prop() handleSubmit: any
  @Prop() handleRetry: any

  @Element() el: HTMLElement

  onItemSelected = (...arg) => {
    this.handleSubmit(...arg)
  }

  renderNavigation = () => {
    switch (this.ui) {
      case InterfaceState.Loading:
        return <navigation-loader />

      case InterfaceState.Subscribe:
        return <navigation-list items={this.items} onSubmitted={this.onItemSelected} />

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
          text={p('btn.main_action', 0, 'Subscribe to list')}
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
