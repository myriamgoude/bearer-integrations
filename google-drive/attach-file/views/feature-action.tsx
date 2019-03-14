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
  Listen,
  Output,
  Prop,
  RootComponent,
  State,
  t,
  p
} from '@bearer/core'
import '@bearer/ui'
import { File } from './types'

export type TAuthorizedPayload = { authId: string }

export enum InterfaceState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  Loading = 'Loading',
  Folder = 'Folder',
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Loading]: 'Loading...',
  [InterfaceState.Folder]: 'Select a file',
  [InterfaceState.Error]: 'Something went wrong',
  [InterfaceState.Settings]: 'Settings'
}

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
  @Prop() autoClose: boolean = true
  @Prop() multi: boolean = true
  @Prop() authId: string

  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch
  @Intent('fetchPreviousFolder') fetchPreviousFolder: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false
  @State() openPopoverOnceLoggedIn: boolean = false

  @State() data: File[] | undefined
  @State() path: string[] | undefined = []
  @State() selectedFolder: File | undefined
  @State() filesSearchResults: File[] | undefined
  @State() rootFolder: boolean | undefined = false

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>

  @Output() files: File[] = []

  @Element() el: HTMLElement

  @Listen('body:edit-removed')
  fileRemovedHandler(e: CustomEvent) {
    const file = e.detail as File
    const updatedList = this.files.filter((elm: File) => file.id !== elm.id)
    this.files = [...updatedList]
  }

  handleRetry = () => {
    this.ui = InterfaceState.Authenticated
    this.handleAttachClick()
  }

  handleAttachClick = () => {
    if (this.ui > InterfaceState.Authenticated) {
      this.data = undefined
      this.ui = InterfaceState.Authenticated
      return
    }
    this.selectedFolder = undefined
    this.errorMessage = undefined
    this.ui = InterfaceState.Folder
    this.getData({ authId: this.authId })
      .then(({ data }: { data: File[] }) => {
        this.data = data
      })
      .catch(this.handleError)
  }

  handleSearchQuery = (query: string) => {
    this.data = undefined
    this.filesSearchResults = undefined
    const req =
      query.length > 3 ? this.searchData({ authId: this.authId, query }) : this.getData({ authId: this.authId })
    req
      .then(({ data }: { data: File[] }) => {
        this.filesSearchResults = data
      })
      .catch(this.handleError)
  }

  handleFolderSelect = (selectedFolder: File) => {
    this.rootFolder = true
    this.data = undefined
    let params = {} as { folderId: string }
    params.folderId = `${selectedFolder.id}`
    this.getData({ authId: this.authId, ...params })
      .then(({ data }: { data: File[] }) => {
        this.data = data
      })
      .catch(this.handleError)
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleItemSelect = (selectedItem: File) => {
    this.filesSearchResults = undefined
    if (selectedItem.mimeType === 'application/vnd.google-apps.folder') {
      this.selectedFolder = selectedItem
      this.path.push(selectedItem.name)
      this.handleFolderSelect(selectedItem)
    } else {
      this.handleAttachFile(selectedItem)
    }
  }

  handleWorkflowBack = () => {
    this.path.splice(-1, 1)
    switch (this.ui) {
      case InterfaceState.Settings:
      case InterfaceState.Folder:
        this.fetchPreviousFolderData()
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
    }
  }

  fetchPreviousFolderData = () => {
    if (!this.selectedFolder || !this.selectedFolder.parents) {
      this.data = undefined
      this.filesSearchResults = undefined
      this.ui = InterfaceState.Authenticated
      return
    }
    this.data = undefined
    this.getData({ authId: this.authId, folderId: this.selectedFolder.parents[0] })
      .then(({ data }: { data: File[] }) => {
        this.data = data
      })
      .catch(this.handleError)
    this.fetchPreviousFolder({ authId: this.authId, folderId: this.selectedFolder.parents[0] })
      .then(({ data }: { data: File }) => {
        if (!data.parents) {
          this.rootFolder = false
        }
        this.selectedFolder = data
      })
      .catch(this.handleError)
  }

  handleAttachFile = (file: any) => {
    file.path = this.path
    if (this.multi) {
      const files = this.files.length ? this.files : (this as any).filesInitial || []
      this.files = [...files.filter((elm: File) => file.id !== elm.id), file as File]
    } else {
      this.files = [file]
    }
    if (this.autoClose) {
      this.ui = InterfaceState.Authenticated
    }
    this.data = undefined
    this.path = []
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  renderUnauthorized: any = () => (
    <connect-action
      text-unauthenticated={p('btn.main_action', this.multi ? 2 : 1, 'Attach a file')}
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
    const subHeading = this.selectedFolder && this.ui !== InterfaceState.Settings ? `From ${this.selectedFolder.name}` : undefined
    const handleBack = this.rootFolder && this.handleWorkflowBack
    const handleClose = this.handleExternalClick
    const handleMenu = this.ui == InterfaceState.Settings ? undefined : this.handleMenu

        return (
    <popover-screen
    ui={this.ui}
    authId={this.authId}
    heading={heading}
    subHeading={subHeading}
    errorMessage={this.errorMessage}
    items={this.data}
    handleSearchQuery={this.handleSearchQuery}
    handleBack={handleBack}
    handleClose={handleClose}
    handleMenu={handleMenu}
    handlePopoverToggler={this.handleAttachClick}
    handleItemSelection={this.handleItemSelect}
    handleRetry={this.handleRetry}
    />
        )
  }

  handleRemove = (file: File) => {
    const updatedList = this.files.filter((elm: File) => file.id !== elm.id)
    console.log('remove', file, updatedList)
  }

  handleExternalClick = (_e: Event) => {
    this.data = undefined
    this.selectedFolder = undefined
    this.filesSearchResults = undefined
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
