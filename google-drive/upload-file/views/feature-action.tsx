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
  t
} from '@bearer/core'
import '@bearer/ui'
import { File } from './types'

import IconSettings from './icons/icon-settings'
import IconClose from './icons/icon-close'

export type TAuthorizedPayload = { authId: string }

export enum InterfaceState {
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  Folder = 'Folder',
  Settings = 'Settings',
  Error = 'Error'
}

const StateTitles = {
  [InterfaceState.Folder]: 'Select destination',
  [InterfaceState.Error]: 'Select destination',
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

  @Prop() fileURL: string = 'http://www.pdf995.com/samples/pdf.pdf'

  @Intent('listData') getData: BearerFetch
  @Intent('searchData') searchData: BearerFetch
  @Intent('fetchMainFolder') fetchMainFolder: BearerFetch
  @Intent('uploadFile') uploadFileIntent: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage: string | undefined
  @State() isAuthorized: boolean = false
  @State() openPopoverOnceLoggedIn: boolean = false

  @State() foldersData: File[] | undefined
  @State() selectedFolder: File | undefined
  @State() foldersSearchResults: File[] | undefined
  @State() rootFolder = false
  @State() showButton = true

  @Event() authorized: EventEmitter<TAuthorizedPayload>
  @Event() revoked: EventEmitter<TAuthorizedPayload>

  @Output() folders: File[]

  @Element() el: HTMLElement

  @Listen('body:edit-removed')
  fileRemovedHandler(e: CustomEvent) {
    const folder = e.detail as File
    const updatedList = this.folders.filter((elm: File) => folder.id !== elm.id)
    this.folders = [...updatedList]
  }

  handleRetry = () => {
    this.ui = InterfaceState.Authenticated
    this.handleAttachClick()
  }

  handleAttachClick = () => {
    if (this.ui > InterfaceState.Authenticated) {
      this.foldersData = undefined
      this.ui = InterfaceState.Authenticated
      return
    }
    this.selectedFolder = undefined
    this.errorMessage = undefined
    this.ui = InterfaceState.Folder
    this.getData({ authId: this.authId })
      .then(({ data }: { data: File[] }) => {
        this.foldersData = data
      })
      .catch(this.handleError)
  }

  handleSearchQuery = (query: string) => {
    this.foldersData = undefined
    this.foldersSearchResults = undefined
    const req =
      query.length > 3 ? this.searchData({ authId: this.authId, query }) : this.getData({ authId: this.authId })
    req
      .then(({ data }: { data: File[] }) => {
        this.foldersSearchResults = data
      })
      .catch(this.handleError)
  }

  handleFolderSelect = (selectedFolder: File) => {
    this.rootFolder = true
    this.foldersData = undefined
    let params = {} as { folderId: string }
    params.folderId = `${selectedFolder.id}`
    this.getData(params)
      .then(({ data }: { data: File[] }) => {
        this.foldersData = data
      })
      .catch(this.handleError)
  }

  handleError = error => {
    this.ui = InterfaceState.Error
    this.errorMessage = error.error
  }

  handleItemSelect = (selectedItem: File) => {
    this.foldersSearchResults = undefined
    this.selectedFolder = selectedItem
    this.handleFolderSelect(selectedItem)
  }

  handleWorkflowBack = () => {
    switch (this.ui) {
      case InterfaceState.Settings:
      case InterfaceState.Folder:
        this.getMainFolder()
        break
      case InterfaceState.Error:
        this.ui = InterfaceState.Authenticated
        break
    }
  }

  handleAttachFolder = async () => {
    if (!this.selectedFolder) {
      this.rootFolder = true
      this.getMainFolder(true)
    } else {
      this.folders = [this.selectedFolder]
      this.uploadFile()
    }
    if (this.autoClose) {
      this.ui = InterfaceState.Authenticated
      this.foldersData = undefined
    }
    this.rootFolder = false
  }

  getMainFolder = (attach?: boolean) => {
    if (!this.rootFolder) {
      this.foldersData = undefined
      this.foldersSearchResults = undefined
      this.ui = InterfaceState.Authenticated
      return
    }
    this.foldersData = undefined
    this.getData({ authId: this.authId, folderId: this.selectedFolder ? this.selectedFolder.parents[0] : 'root' })
      .then(({ data }: { data: File[] }) => {
        this.foldersData = data
      })
      .catch(this.handleError)
    this.fetchMainFolder({
      authId: this.authId,
      folderId: this.selectedFolder ? this.selectedFolder.parents[0] : 'root'
    })
      .then(({ data }: { data: File }) => {
        if (!data.parents) {
          this.rootFolder = false
        }
        this.selectedFolder = data
        if (attach) {
          this.folders = [data]
          this.uploadFile()
        }
      })
      .catch(this.handleError)
  }

  uploadFile = () => {
    if (this.fileURL) {
      this.uploadFileIntent({ fileUrl: this.fileURL, folderId: this.selectedFolder.id })
        .then(() => {
          console.log('success')
        })
        .catch(this.handleError)
    }
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  renderUnauthorized: any = () => (
    <connect-action
      text-unauthenticated={t('btn.main_action', 'Save to Google Drive')}
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
          text={t('texts.saveToGoogle', 'Save to Google Drive')}
        />
        {this.renderWorkflow()}
      </bearer-popover>
    )
  }

  renderWorkflow = () => {
    if (this.ui <= InterfaceState.Authenticated) {
      return null
    }

    // return (
    //   <workflow-box
    //     onBack={this.handleWorkflowBack}
    //     showSaveButton={this.showButton}
    //     selectedFolder={this.selectedFolder}
    //     rootFolder={this.rootFolder}
    //     onClose={this.handleExternalClick}
    //     onSaveClicked={this.handleAttachFolder}
    //   >
    //     {this.renderWorkflowContent()}
    //   </workflow-box>
    // )
    const heading = t(`headings.step-${this.ui}`, StateTitles[this.ui])
    const subHeading = this.selectedFolder
      ? t('texts.selectedFolder', 'From {{name}}', { name: this.selectedFolder.name })
      : undefined
    const handleBack = this.rootFolder && subHeading && this.handleWorkflowBack
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
      case InterfaceState.Error:
        this.rootFolder = false
        this.showButton = false
        return <error-message message={this.errorMessage} onRetry={this.handleRetry} />
      case InterfaceState.Settings:
        return <connect-action authId={this.authId} text-authenticated='Logout' icon='ios-log-out' />

      case InterfaceState.Folder:
        if (this.foldersSearchResults) {
          return (
            <div>
              <list-navigation
                options={this.foldersSearchResults}
                attributeName={'name'}
                onSearchQuery={this.handleSearchQuery}
                showNextIcon={true}
                onOptionClicked={this.handleItemSelect}
              />
            </div>
          )
        }
        return (
          <div>
            <list-navigation
              options={this.foldersData}
              attributeName={'name'}
              onSearchQuery={this.handleSearchQuery}
              showNextIcon={true}
              onOptionClicked={this.handleItemSelect}
            />
          </div>
        )
    }
    return null
  }

  handleExternalClick = (_e: Event) => {
    this.foldersData = undefined
    this.selectedFolder = undefined
    this.foldersSearchResults = undefined
    this.rootFolder = false
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
