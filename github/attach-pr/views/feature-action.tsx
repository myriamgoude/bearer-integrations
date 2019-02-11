import { 
  RootComponent, 
  Output, 
  State, 
  BearerFetch, 
  Prop,
  Intent, 
  Element
} from '@bearer/core'

import '@bearer/ui'

import { PullRequest, Repo } from './types'
import { Listen } from '@stencil/core';

enum InterfaceState {
  Unauthenticated,
  Authenticated,
  Repo,
  PullRequest,
  Settings,
  Error,
}

const StateTitles = {
  [InterfaceState.Repo]: 'Select a Repository',
  [InterfaceState.PullRequest]:'Attach pull request',
  [InterfaceState.Error]:'Select a Repository',
  [InterfaceState.Settings]:'Settings',
}

const PULL_STYLE = {
  MERGED: {
    color: '#0FE49B'
  },
  OPEN: {
    color: '#FFC400'
  },
  CLOSED: {
    color: '#E44C0F'
  }
}

@RootComponent({
  group: 'feature',
  role: 'action',
})
export class FeatureAction {

  // automatically close popover when a selection has been made
  @Prop() autoClose:boolean = true
  // allow multiple PR to be attached i.e selecting an item will apprend it to the list
  @Prop() multi:boolean = true

  @Intent('listRepositoryGraph') getRepositoryGraph: BearerFetch
  @Intent('searchPullRequests') searchPullRequests: BearerFetch

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage:string | undefined
  @State() revoke:any | undefined

  @State() repos:Repo[] | undefined
  @State() selectedRepo:Repo | undefined
  @State() pullRequestSearchResults:PullRequest[] | undefined

  // Output is named pullRequests and is an Array of PullRequest
  @Output() pullRequests: PullRequest[] = []

  @Element() el: HTMLElement;

  @Listen('body:edit-removed')
  pullRemovedHandler (e:CustomEvent) {
    const pr = e.detail as PullRequest;
    const updatedList = this.pullRequests.filter((elm: PullRequest) => pr.id !== elm.id)
    this.pullRequests = [...updatedList]
  }

  getPullRequests = () => {
    return (this.pullRequests.length) ? this.pullRequests : (this as any).pullRequestsInitial || []
  }

  handleRetry = () => {
    this.ui = InterfaceState.Authenticated
    this.handleAttachClick()
  }
  
  handleAttachClick = () => {
    this.selectedRepo = undefined
    this.errorMessage = undefined
    this.ui = InterfaceState.Repo
    this.getRepositoryGraph()
    .then(({data}:{data: Repo[]}) => {
      this.repos = data
    }).catch(this.handleError)
  }

  handleSearchQuery = (query: string) => {
    this.pullRequestSearchResults = undefined
    const req = (query.length < 3) ? 
      this.searchPullRequests({id: this.selectedRepo.id }) 
      : this.searchPullRequests({name: this.selectedRepo.nameWithOwner, query})
    req.then(({data}:{data: PullRequest[]}) => {
      this.pullRequestSearchResults = data
    }).catch(this.handleError)
  }

  handleError = error => {
      this.ui = InterfaceState.Error
      this.errorMessage = error.error;
  }

  handleRepoSelect = (selectedRepo: Repo) => {
    this.selectedRepo = selectedRepo
    this.handleSearchQuery('')
    this.ui = InterfaceState.PullRequest
  }

  handleWorkflowBack = () => {
    this.selectedRepo = undefined
    switch(this.ui){
      case InterfaceState.Settings:
      case InterfaceState.PullRequest:
        this.ui = InterfaceState.Repo
        break;
      case InterfaceState.Error:
      case InterfaceState.Repo:
        this.ui = InterfaceState.Authenticated
        break;
    }
  }

  handleAttachPullRequest = (pr: any) => {
    if(this.multi){
      const pulls = this.getPullRequests()
      this.pullRequests = [
        ...pulls.filter((elm: PullRequest) => pr.id !== elm.id),
        (pr as PullRequest)
      ]
    }else{
      this.pullRequests = [pr]
    }
    if(this.autoClose){
      this.ui = InterfaceState.Authenticated
    }
  }

  handleMenu = () => {
    this.ui = InterfaceState.Settings
  }

  handleLogout = () => {
    if(this.revoke){ this.revoke() }
    this.revoke = undefined
    this.ui = InterfaceState.Unauthenticated
  }

  onAuthorizeClick = (authenticate: () => Promise<boolean>) => {
    authenticate()
      .then(()=>{
        this.ui = InterfaceState.Authenticated
        this.handleAttachClick()
      })
      .catch(console.error)
  }

  renderUnauthorized: any = ({ authenticate }) => (
    <icon-button
      onClick={() => this.onAuthorizeClick(authenticate)}
      icon="logo-github"
      text="Attach Pull Request"
    />
  )

  handleAuthorized: any = ({ revoke }) => {
    this.revoke = revoke
  }

  renderAuthorized: any = () => {
    if (this.ui < InterfaceState.Authenticated) {
      return null;
    }
    
    return(<bearer-popover opened={this.ui > InterfaceState.Authenticated }>
      <icon-button
        onClick={this.handleAttachClick}
        icon="logo-github"
        text="Attach Pull Request"
        slot="popover-toggler"
      />
        {this.renderWorkflow()}
      </bearer-popover>)
  }

  renderWorkflow = () => {
    if(this.ui > InterfaceState.Authenticated) {

      const heading = StateTitles[this.ui] || "";
      const subHeading= (this.selectedRepo) ? `From ${this.selectedRepo.nameWithOwner}` : undefined;
      const handleBack = (this.ui > InterfaceState.Repo) ? this.handleWorkflowBack : undefined;
      const handleClose = this.handleExternalClick;
      const handleMenu = this.handleMenu;

      return [
        <div slot="popover-header">
          <div class="popover-header">
            {(handleBack) && <icon-chevron class="popover-back-nav" direction="left" onClick={handleBack} />}
            <div class="popover-title">
              <h3>{heading}</h3>
              {(subHeading) && <span class="popover-subtitle">{subHeading}</span>}
            </div>
          </div>
          <div class="popover-controls">
           {(handleMenu) && <button class='popover-control' onClick={handleMenu}>{this.getIcon('settings')}</button>}
           {(handleClose) && <button class='popover-control' onClick={handleClose}><ion-icon name="close"></ion-icon></button>}
          </div>
        </div>,
        <div slot="popover-content">{this.renderWorkflowContent()}</div>
      ]
    }
  }

  getIcon(icon: string) {
    if (icon === "settings") {
      return (<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" ><path d="M23,50c0,5-4,9-9,9s-9-4-9-9c0-5,4-9,9-9S23,45,23,50z M86,41c-5,0-9,4-9,9c0,5,4,9,9,9s9-4,9-9C95,45,91,41,86,41z M51,41  c-5,0-9,4-9,9c0,5,4,9,9,9c5,0,9-4,9-9C60,45,56,41,51,41z"/></svg>)
    }
  }

  renderWorkflowContent = () => {
    switch(this.ui){
      case InterfaceState.Error:
        return <error-message
          message={this.errorMessage}
          onRetry={this.handleRetry}
        />
      case InterfaceState.Settings:
        // just use the same handler for all options as we just have logout
        return (
          <list-navigation
          options={[
            {name: 'Logout', icon: 'ios-log-out'}
          ]}
          attributeName={'name'}
          showNextIcon={false}
          onOptionClicked={this.handleLogout} />
        )
      case InterfaceState.Repo:
        return (  
          <list-navigation
          options={this.repos}
          attributeName={'nameWithOwner'}
          showNextIcon={true}
          onOptionClicked={this.handleRepoSelect} />
        )
      case InterfaceState.PullRequest:
        return (
          <list-navigation
          options={this.pullRequestSearchResults}
          disabledOptions={this.getPullRequests()}
          onSearchQuery={this.handleSearchQuery}
          attributeName={'title'}
          attributeId={'id'}
          formatLabel={
            (pr:any) => {
              const pull = (pr as PullRequest)
              return (
                <div>
                  <span style={{color:'#989EB3'}}>
                    #{pull.number}
                  </span> • <span style={PULL_STYLE[pull.state]}>
                    {pull.state}
                  </span> • {pull.title}
                </div>
              )
            }
          }
          showNextIcon={false}
          onOptionClicked={this.handleAttachPullRequest} />
        )
    }
    return null
  }

  handleExternalClick = (_e:Event) => {
    this.selectedRepo = undefined
    if(this.ui != InterfaceState.Unauthenticated){
      this.ui = InterfaceState.Authenticated
    }
  }

  handleRemove = (pr: PullRequest) =>{
    const updatedList = this.pullRequests.filter((elm:PullRequest)=> pr.id !== elm.id)
    console.log('remove', pr, updatedList)
  }

  render() {
    return (
      <div>
        <bearer-authorized
          renderUnauthorized={this.renderUnauthorized}
          renderAuthorized={this.handleAuthorized}
        />
        { this.renderAuthorized() }
      </div>
    )
  }
}