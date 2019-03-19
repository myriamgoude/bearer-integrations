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
  @Prop() subHeading: string = "The test folder"
  @Prop() errorMessage: string

  @Prop() items: NavigationItem[]
  @Prop() handleClose: any
  @Prop() handleBack: any
  @Prop() handleMenu: any
  @Prop() handleSearchQuery: any
  @Prop() handlePopoverToggler: any
  @Prop() handleItemSelection: any
  @Prop() handleSheetCreate: any
  @Prop() handleRetry: any

  @Element() el: HTMLElement

  renderNavigation = () => {
    switch (this.ui) {
      case InterfaceState.Loading:
        return <navigation-loader />

      case InterfaceState.Folder:
        return [
          <navigation-search onSearchQuery={this.handleSearchQuery} />,
          <navigation-list items={this.items} onSubmitted={this.handleItemSelection} onSaveClicked={this.handleSheetCreate} />
        ]

      case InterfaceState.Settings:
        return <connect-action authId={this.authId} text-authenticated={'Logout'} icon='ios-log-out' />

      case InterfaceState.Error:
        return <navigation-error message={this.errorMessage} onRetry={this.handleRetry} />

      case InterfaceState.Creating:
        return <navigation-creating folder={this.subHeading} />

      case InterfaceState.Success:
        return <navigation-success />
    }
    return null
  }

  render() {
    return (
      <bearer-popover opened={this.ui > InterfaceState.Authenticated}>
        <icon-button
            slot='popover-toggler'
            onClick={this.handlePopoverToggler}
            text={'Export to Spreadsheet'} />
        <div slot='popover-header'>
          <div {...{class : this.subHeading ? 'popover-header' : 'popover-header-no-sub'}} >
            <div>{this.handleBack && <icon-chevron {...{class : this.subHeading ? 'popover-back-nav baseline-align' : 'popover-back-nav'}} direction='left' onClick={this.handleBack} />}</div>
            <div class='popover-title'>
              <div>
              <h3>{this.heading}</h3>
              {this.subHeading && <span class='popover-subtitle'>{this.subHeading}</span>}
            </div>
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
