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
  @Prop() subHeading: string
  @Prop() errorMessage: string

  @Prop() items: NavigationItem[]
  @Prop() handleClose: any
  @Prop() handleBack: any
  @Prop() handleMenu: any
  @Prop() handleSearchQuery: any
  @Prop() handlePopoverToggler: any
  @Prop() handleItemSelection: any
  @Prop() handleRetry: any

  @Element() el: HTMLElement

  clearSearch = () => {
    const search = this.el.querySelector('navigation-search')
    if (search) {
      search.clearValue()
    }
  }

  onItemSelected = (...arg) => {
    this.clearSearch()
    this.handleItemSelection(...arg)
  }

  renderNavigation = () => {
    switch (this.ui) {
      case InterfaceState.Loading:
        this.clearSearch()
        return <navigation-loader />

      case InterfaceState.Users:
        return [
          <navigation-search onSearchQuery={this.handleSearchQuery} />,
          <navigation-list items={this.items} onSubmitHandler={this.onItemSelected} />
        ]

      case InterfaceState.Settings:
        this.clearSearch()
        return <connect-action authId={this.authId} text-authenticated={t('btn.logout', 'Logout')} icon='ios-log-out' />

      case InterfaceState.Error:
        this.clearSearch()
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
          text={p('btn.main_action', this.multi ? 2 : 1, 'Get invoices')}
        />
        <div slot='popover-header'>
          <div class='popover-header'>
            {this.handleBack && <icon-chevron class='popover-back-nav' direction='left' onClick={this.handleBack} />}
            <div class='popover-title'>
              <h3>{this.heading}</h3>
              {this.subHeading && <span class='popover-subtitle'>{this.subHeading}</span>}
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
