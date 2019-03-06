import { Component, Prop, Element } from '@bearer/core'

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

  renderNavigation = () => {
    switch (this.ui) {
      case InterfaceState.Loading:
        return <navigation-loader />

      case InterfaceState.Folder:
        return [
          <navigation-search onSearchQuery={this.handleSearchQuery} />,
          <navigation-list items={this.items} onSubmitted={this.handleItemSelection} />
        ]

      case InterfaceState.Settings:
        return <connect-action authId={this.authId} text-authenticated={'Logout'} icon='ios-log-out' />

      case InterfaceState.Error:
        return <navigation-error message={this.errorMessage} onRetry={this.handleRetry} />
    }
    return null
  }

  render() {
    window.setTimeout(() => {
      console.log('ui?', this.ui)
      console.log('should be opened?', this.ui > InterfaceState.Authenticated)
      console.log('InterfaceState.Authenticated?', InterfaceState.Authenticated)
      console.log('is opened?', this.el.querySelector('bearer-popover').opened)
    }, 500)
    return (
      <bearer-popover opened={this.ui > InterfaceState.Authenticated}>
        <icon-button slot='popover-toggler' onClick={this.handlePopoverToggler} text={'Save a file'} />
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
