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

import IconSettings from './icons/icon-settings'
import IconClose from './icons/icon-close'

export type TAuthorizedPayload = { authId: string }

enum InterfaceState {
  Unauthenticated,
  Authenticated,
  Loading,
  Folder,
  Settings,
  Error
}

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
  @Prop() autoClose: boolean = true
  @Prop() multi: boolean = false
  @Prop() authId: string

  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch
  @Intent('fetchPreviousFolder') fetchPreviousFolder: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false
  @State() openPopoverOnceLoggedIn: boolean = false

  @State() items: File[] | undefined
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
      this.ui = InterfaceState.Authenticated
      return
    }

    this.items = undefined
    this.selectedFolder = undefined
    this.errorMessage = undefined
    this.ui = InterfaceState.Loading

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
    const req = this.searchData({ authId: this.authId, query })

    req
      .then(({ data }: { data: File[] }) => {
        this.items = data
      })
      .catch(this.handleError)
  }

  handleFolderSelect = (selectedFolder: File) => {
    this.items = undefined
    let params = {} as { folderPath: string }
    params.folderPath = `${selectedFolder.path_lower}`
    this.getData({ authId: this.authId, ...params })
      .then(({ data }: { data: File[] }) => {
        this.items = data
      })
      .catch(this.handleError)
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleItemSelect = (selectedItem: File) => {
    this.items = undefined
    if (selectedItem['.tag'] === 'folder') {
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
    if (!this.selectedFolder) {
      this.items = undefined
      this.ui = InterfaceState.Authenticated
      return
    }
    this.items = undefined
    this.getData({
      authId: this.authId,
      folderPath: this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '')
    })
      .then(({ data }: { data: File[] }) => {
        this.items = data
      })
      .catch(this.handleError)
    if (this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '') !== '') {
      this.fetchPreviousFolder({
        authId: this.authId,
        folderPath: this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '')
      })
        .then(({ data }: { data: File }) => {
          this.selectedFolder = data
        })
        .catch(this.handleError)
    } else {
      this.selectedFolder = undefined
      this.rootFolder = false
    }
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
    this.items = undefined
    this.path = []
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  // handleLogout = () => {
  //     if(this.revoke){ this.revoke() }
  //     this.revoke = undefined;
  //     this.ui = InterfaceState.Unauthenticated
  // };

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

    return (
      <bearer-popover opened={this.ui > InterfaceState.Authenticated}>
        <icon-button
          slot='popover-toggler'
          onClick={this.handleAttachClick}
          text={p('btn.main_action', this.multi ? 2 : 1, 'Attach a file')}
        />
        {this.renderWorkflow()}
      </bearer-popover>
    )
  }

  renderWorkflow = () => {
    if (this.ui <= InterfaceState.Authenticated) {
      return null
    }

    const StateTitles = {
      [InterfaceState.Loading]: t('state.loading', 'Loading...'),
      [InterfaceState.Folder]: p('state.select', this.multi ? 2 : 1, 'Select a file'),
      [InterfaceState.Error]: t('state.error', 'Something went wrong'),
      [InterfaceState.Settings]: t('state.setting', 'Settings')
    }

    const heading = StateTitles[this.ui] || ''
    const subHeading =
      this.selectedFolder && this.ui !== InterfaceState.Settings ? `From ${this.selectedFolder.name}` : undefined
    const handleBack = !this.rootFolder && this.handleWorkflowBack
    const handleClose = this.handleExternalClick
    const handleMenu = this.ui == InterfaceState.Settings ? undefined : this.handleMenu

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
      case InterfaceState.Loading:
        return <navigation-loader />

      case InterfaceState.Folder:
        return [
          <navigation-search onSearchQuery={this.handleSearchQuery} />,
          <navigation-list items={this.items} onSubmitted={this.handleItemSelect} />
        ]

      case InterfaceState.Settings:
        return <connect-action authId={this.authId} text-authenticated={t('btn.logout', 'Logout')} icon='ios-log-out' />

      case InterfaceState.Error:
        return <navigation-error message={this.errorMessage} onRetry={this.handleRetry} />
    }
    return null
  }

  handleExternalClick = (_e: Event) => {
    this.items = undefined
    this.selectedFolder = undefined
    if (this.ui != InterfaceState.Unauthenticated) {
      this.ui = InterfaceState.Authenticated
    }
  }

  handleInternalClick = (e: Event) => {
    e.stopImmediatePropagation()
  }

  // handleRemove = (file: File) =>{
  //     const updatedList = this.files.filter((elm:File)=> file.id !== elm.id);
  //     console.log('remove', file, updatedList)
  // };

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
