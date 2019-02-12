import { 
  RootComponent, 
  Prop,
  State,
  Element,
  Watch,
  Listen
} from '@bearer/core'

import '@bearer/ui'
import { Event, EventEmitter } from '@stencil/core'

export enum InterfaceState {
  Unauthenticated,
  Authenticated,
  Repo,
  PullRequest,
  Settings,
  Error,
}

@RootComponent({
  group: 'connect',
  role: 'action',
})
export class ConnectAction {

  @Prop() textAuthenticated: string
  @Prop() textUnauthenticated: string
  @Prop() icon: string
  @Prop() onClick: (event: MouseEvent) => void

  @State() ui: InterfaceState = InterfaceState.Unauthenticated
  @State() errorMessage:string | undefined
  @State() revoke:any | undefined
  @State() isAuthorized: boolean

  @Event() authenticationStateChanged: EventEmitter
  @Element() el: HTMLElement;

  handleError = error => {
      this.ui = InterfaceState.Error
      this.errorMessage = error.error;
  }

  handleLogin = () => {
    this.ui = InterfaceState.Authenticated
    this.isAuthorized = true;
  }

  handleLogout = () => {
    if(this.revoke){ this.revoke() }
    this.revoke = undefined
    this.ui = InterfaceState.Unauthenticated
    this.isAuthorized = false;
  }

  onAuthorizeClick = (authenticate: () => Promise<boolean>) => {
    authenticate()
      .then(this.handleLogin)
      .catch((err) => {
        this.handleLogout();
        console.error(err)
      })
  }

  renderUnauthorized: any = ({ authenticate }) => {
    return <icon-button
      onClick={() => this.onAuthorizeClick(authenticate)}
      icon={this.icon}
      text={this.textUnauthenticated}
    />
  }

  renderAuthorized: any = ({ revoke }) => {
    this.revoke = revoke
    
    return(<icon-button
      onClick={() => this.handleLogout()}
      icon={this.icon}
      text={this.textAuthenticated}
    />)
  }

  @Watch("isAuthorized")
  watchIsAuthorized(newValue: boolean, oldValue: boolean) {
    this.authenticationStateChanged.emit({newValue, oldValue});
  }

  @Listen("body:feature:logout")
  logoutEventListener() {
    this.handleLogout()
  }
  

  render() {
    return (<bearer-authorized
      renderUnauthorized={this.renderUnauthorized}
      renderAuthorized={this.renderAuthorized}
    />)
  }
}