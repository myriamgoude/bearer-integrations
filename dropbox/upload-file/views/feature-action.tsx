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
  @Prop() multi: boolean = true
  @Prop() authId: string
  @Prop() fileUrl: string
  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch
  //   @Intent('fetchMainFolder') fetchMainFolder: BearerFetch
  @Intent('uploadFile') uploadFile: BearerFetch

  @State() foldersData: File[] | undefined
  @State() selectedFolder: File | undefined
  @State() foldersSearchResults: File[] | undefined
  @State() showButton = true

  //
  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false

  @State() items: File[] | undefined

  path: File[] = []
  rootFolder: boolean = true
  openPopoverOnceLoggedIn: boolean = false

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>

  @Output() folders: File[]

  @Element() el: HTMLElement

  @Listen('body:edit-removed')
  fileRemovedHandler(e: CustomEvent) {
    const folder = e.detail as File
    if (folder.id === 'root') {
      this.folders[0] = folder
    }
    const updatedList = this.folders.filter((elm: File) => folder.id !== elm.id)
    this.folders = [...updatedList]
  }

  handleRetry = () => {
    this.ui = InterfaceState.Authenticated
    this.togglePopover()
  }

  togglePopover = () => {
    console.log('this.togglePopover', this.ui)
    if (this.ui > InterfaceState.Authenticated) {
      this.ui = InterfaceState.Authenticated
      console.log(this.ui)
      return
    }
    this.selectedFolder = undefined
    this.errorMessage = undefined
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

    this.searchData({ authId: this.authId, query })
      .then(({ data }: { data: File[] }) => {
        this.items = data
      })
      .catch(this.handleError)
  }

  handleFolderSelection = (selectedItem: File) => {
    this.path.push(selectedItem)
    this.listFolder()
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
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

  handleAttachFolder = () => {
    let root
    if (!this.selectedFolder) {
      root = { name: 'Dropbox', path_display: '', path_lower: '', id: 'root' }
      this.folders = [root]
    }
    this.folders = [this.selectedFolder]
    if (this.autoClose) {
      this.ui = InterfaceState.Authenticated
    }

    //TODO need to handle uploading files to google drive using axios

    if (this.fileUrl) {
      this.uploadFile({
        fileUrl: this.fileUrl,
        folderId: this.selectedFolder ? this.selectedFolder.id : root.path_display
      })
        .then(() => {
          console.log('success')
        })
        .catch(this.handleError)
    }
  }

  //   getMainFolder = () => {
  //     if (!this.selectedFolder) {
  //       this.foldersData = undefined
  //       this.ui = InterfaceState.Authenticated
  //       return
  //     }
  //     this.foldersData = undefined
  //     this.getData({
  //       authId: this.authId,
  //       folderPath: this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '')
  //     })
  //       .then(({ data }: { data: File[] }) => {
  //         this.foldersData = data
  //       })
  //       .catch(this.handleError)
  //     if (this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '') !== '') {
  //       this.fetchMainFolder({
  //         authId: this.authId,
  //         folderPath: this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '')
  //       })
  //         .then(({ data }: { data: File }) => {
  //           this.selectedFolder = data
  //         })
  //         .catch(this.handleError)
  //     } else {
  //       this.selectedFolder = undefined
  //       this.rootFolder = false
  //     }
  //   }
  //   renderUnauthorized: any = ({ authenticate }) => (
  //     <icon-button onClick={() => this.onAuthorizeClick(authenticate)} text='Save to Dropbox' />
  //   )

  //   renderAuthorized: any = ({ revoke }) => {
  //     this.revoke = revoke
  //     return <icon-button onClick={this.handleAttachClick} text='Save to Dropbox' />
  //   }

  //   renderWorkflow = () => {
  //     if (this.ui > InterfaceState.Authenticated) {
  //       return (
  //         <workflow-box
  //           heading={StateTitles[this.ui] || ''}
  //           subHeading={this.selectedFolder ? `From ${this.selectedFolder.name}` : undefined}
  //           onBack={this.handleWorkflowBack}
  //           showSaveButton={this.showButton}
  //           selectedFolder={this.selectedFolder}
  //           rootFolder={this.rootFolder}
  //           onClose={this.handleExternalClick}
  //           onSaveClicked={this.handleAttachFolder}
  //           onMenu={this.ui == InterfaceState.Settings ? undefined : this.handleMenu}
  //           style={{ position: 'absolute', marginLeft: '24px' }}
  //         >
  //           {this.renderWorkflowContent()}
  //         </workflow-box>
  //       )
  //     }
  //   }

  handleMenu = () => {
    this.path = []
    this.ui = InterfaceState.Settings
  }

  renderUnauthorized: any = () => (
    <connect-action
      text-unauthenticated={p('btn.main_action', this.multi ? 2 : 1, 'Save a file')}
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
        handleBack={parentFolder ? this.handleWorkflowBack : null}
        handleClose={this.handleExternalClick}
        handleMenu={this.ui == InterfaceState.Settings ? undefined : this.handleMenu}
        handlePopoverToggler={this.togglePopover}
        handleItemSelection={this.handleAttachFolder}
        // handleSubmit={this.handleAttachFolder}
        handleRetry={this.handleRetry}
      />
    )
  }
  //   renderWorkflowContent = () => {
  //     switch (this.ui) {
  //       case InterfaceState.Error:
  //         this.rootFolder = false
  //         this.showButton = false
  //         return <error-message message={this.errorMessage} onRetry={this.handleRetry} />
  //       case InterfaceState.Settings:
  //         this.rootFolder = false
  //         this.showButton = false
  //         // just use the same handler for all options as we just have logout
  //         return (
  //           <list-navigation
  //             options={[{ name: 'Logout', icon: 'ios-log-out' }]}
  //             attributeName={'name'}
  //             showNextIcon={false}
  //             onOptionClicked={this.handleLogout}
  //           />
  //         )
  //       case InterfaceState.Folder:
  //         if (this.foldersSearchResults && this.foldersSearchResults.length !== 0) {
  //           return (
  //             <div>
  //               <list-navigation
  //                 options={this.foldersSearchResults}
  //                 attributeName={'name'}
  //                 onSearchQuery={this.handleSearchQuery}
  //                 showNextIcon={true}
  //                 onOptionClicked={this.handleItemSelect}
  //               />
  //             </div>
  //           )
  //         }
  //         return (
  //           <div>
  //             <list-navigation
  //               options={this.foldersData}
  //               attributeName={'name'}
  //               onSearchQuery={this.handleSearchQuery}
  //               showNextIcon={true}
  //               onOptionClicked={this.handleItemSelect}
  //             />
  //           </div>
  //         )
  //     }
  //     return null
  //   }

  //   handleExternalClick = (_e: Event) => {
  //     this.foldersData = undefined
  //     this.selectedFolder = undefined
  //     this.foldersSearchResults = undefined
  //     this.rootFolder = false
  //     if (this.ui != InterfaceState.Unauthenticated) {
  //       this.ui = InterfaceState.Authenticated
  //     }
  //   }

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
