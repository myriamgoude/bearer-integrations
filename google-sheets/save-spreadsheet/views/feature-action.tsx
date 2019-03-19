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
  Prop,
  RootComponent,
  State,
  t,
  p
} from '@bearer/core'
import '@bearer/ui'
import {File, Sheet} from './types'

export type TAuthorizedPayload = { authId: string }

export enum InterfaceState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  Loading = 'Loading',
  Folder = 'Folder',
  Creating = 'Creating',
  Success = 'Success',
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Loading]: 'Loading...',
  [InterfaceState.Folder]: 'Select destination',
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
  @Prop() data: string
  @Prop() sheetName: string = 'data'
  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch
  @Intent('createSheet') createSheet: BearerFetch
  @Intent('updateFile') updateFile: BearerFetch

  @State() foldersData: File[] | undefined
  @State() selectedFolder: File | undefined
  @State() foldersSearchResults: File[] | undefined
  @State() showButton = true

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false

  @State() items: File[] | undefined

  rootFolder: boolean = true
  openPopoverOnceLoggedIn: boolean = false

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>
  @Event({ eventName: 'created', bubbles: true })
  created: EventEmitter<{ file: File; folder: Folder }>

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
    this.selectedFolder = undefined
    this.errorMessage = undefined
    this.ui = InterfaceState.Loading

    this.listRootFolder()
  }

  listFolder = back => {
    this.items = undefined
    this.errorMessage = undefined
    let params = {} as { folderId: string }

    params.folderId = back ? this.selectedFolder.parents[0] : this.selectedFolder.id

    this.getData({ authId: this.authId, ...params })
      .then(({ data }: { data: File[] }) => {
        this.items = data
        this.ui = InterfaceState.Folder
      })
      .catch(this.handleError)
  }

  listRootFolder = () => {
    this.getData({ authId: this.authId })
      .then(({ data }: { data: File[] }) => {
        this.items = data
        this.ui = InterfaceState.Folder
      })
      .catch(this.handleError)
  }

  handleSearchQuery = (query: string) => {
    this.rootFolder = false
    this.items = undefined

    this.searchData({ authId: this.authId, query })
      .then(({ data }: { data: File[] }) => {
        this.items = data
      })
      .catch(this.handleError)
  }

  handleFolderSelection = (selectedItem: File) => {
    this.selectedFolder = selectedItem
    this.rootFolder = false
    this.listFolder(false)
  }

  handleSheetCreate = () => {
    this.ui = InterfaceState.Creating
    this.createSheet({ sheetName: this.sheetName, data: this.data })
      .then(({ data }: { data: Sheet }) => {
        if (!this.rootFolder) {
          this.updateSheet(data)
          return
        }
        // this.ui = InterfaceState.Creating
        this.ui = InterfaceState.Success
      })
      .catch(this.handleError)
  }

  updateSheet = (sheet: Sheet) => {
    this.updateFile({ sheetId: sheet.spreadsheetId, folderId: this.selectedFolder.id })
      .then(({ data }) => {
        // this.ui = InterfaceState.Creating
        this.ui = InterfaceState.Success
        this.created.emit({ file: data, folder: this.selectedFolder })
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
      case InterfaceState.Folder:
        this.listFolder(true)
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
    }
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  renderUnauthorized: any = () => (
    <connect-action
      text-unauthenticated={p('btn.main_action', 0, 'Export to Spreadsheet')}
      onClick={() => {
        this.openPopoverOnceLoggedIn = true
      }}
    />
  )

  renderAuthorized: any = () => {
    console.log('renderAuthorized')

    if (this.openPopoverOnceLoggedIn) {
      this.openPopoverOnceLoggedIn = false
      this.togglePopover()
    }

    return (
      <popover-screen
        ui={this.ui}
        authId={this.authId}
        heading={t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''}
        errorMessage={this.errorMessage}
        items={this.items}
        handleBack={this.rootFolder ? null : this.handleWorkflowBack}
        handleClose={this.handleExternalClick}
        handleMenu={this.ui == InterfaceState.Settings ? undefined : this.handleMenu}
        handlePopoverToggler={this.togglePopover}
        handleSearchQuery={this.handleSearchQuery}
        handleItemSelection={this.handleFolderSelection}
        handleSheetCreate={this.handleSheetCreate}
        handleRetry={this.handleRetry}
      />
    )
  }

  handleExternalClick = (_e: Event) => {
    this.items = undefined
    this.rootFolder = true
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
