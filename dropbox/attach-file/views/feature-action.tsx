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
  @Prop() multi: boolean = false
  @Prop() authId: string

  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false

  @State() items: File[] | undefined

  path: File[] = []
  rootFolder: boolean = true
  openPopoverOnceLoggedIn: boolean = false

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
    this.togglePopover()
  }

  togglePopover = () => {
    if (this.ui > InterfaceState.Authenticated) {
      this.ui = InterfaceState.Authenticated
      return
    }

    this.ui = InterfaceState.Loading
    this.path = []

    this.listFolder()
  }

  listFolder = () => {
    this.items = undefined
    this.errorMessage = undefined
    this.rootFolder = !this.path.length

    let params = {} as { folderPath: string }

    if (!this.rootFolder) {
      const currentFolder = this.path[this.path.length - 1]
      params.folderPath = currentFolder && `${currentFolder.path_lower}`
    }

    this.getData({ authId: this.authId, ...params })
      .then(({ data }: { data: File[] }) => {
        this.items = data
        this.ui = InterfaceState.Folder
      })
      .catch(this.handleError)
  }

  handleSearchQuery = (query: string) => {
    this.rootFolder = false
    this.items = undefined

    const req = query.length > 3 ? this.searchData({authId: this.authId, query}) : this.getData({ authId: this.authId})

      req.then(({ data }: { data: File[] }) => {
        this.items = data
      })
      .catch(this.handleError)
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleItemSelectìon = (selectedItem: File) => {
    if (selectedItem['.tag'] === 'folder') {
      this.path.push(selectedItem)
      this.listFolder()
    } else {
      this.handleAttachFile(selectedItem)
    }
  }

  handleWorkflowBack = () => {
    this.path.splice(-1, 1)
    switch (this.ui) {
      case InterfaceState.Settings:
      case InterfaceState.Folder:
        this.listFolder()
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
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
    this.path = []
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
      this.togglePopover()
    }

    const parentFolder = this.path.length && this.path[this.path.length - 1]
    const subHeading = parentFolder && this.ui !== InterfaceState.Settings ? `From ${parentFolder.name}` : undefined

    return (
      <popover-screen
        ui={this.ui}
        authId={this.authId}
        heading={t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''}
        subHeading={subHeading}
        errorMessage={this.errorMessage}
        items={this.items}
        handleSearchQuery={this.handleSearchQuery}
        handleBack={parentFolder ? this.handleWorkflowBack : null}
        handleClose={this.handleExternalClick}
        handleMenu={this.ui == InterfaceState.Settings ? undefined : this.handleMenu}
        handlePopoverToggler={this.togglePopover}
        handleItemSelection={this.handleItemSelectìon}
        handleRetry={this.handleRetry}
      />
    )
  }

  handleExternalClick = (_e: Event) => {
    this.items = undefined
    this.path = []
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
