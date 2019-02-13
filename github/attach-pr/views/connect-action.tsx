import { 
  RootComponent, 
  Prop,
  State,
  Element,
  Listen
} from '@bearer/core'

import '@bearer/ui'
import { Event, EventEmitter } from '@stencil/core'

@RootComponent({
  group: 'connect',
  role: 'action',
})
export class ConnectAction {

  @Prop() textAuthenticated: string
  @Prop() textUnauthenticated: string
  @Prop() icon: string

  @State() errorMessage:string | undefined
  @State() revoke:any | undefined
  @State() isAuthorized: boolean

  @Event() authenticationStateChanged: EventEmitter
  @Element() el: HTMLElement;

  handleLogin = () => {
    this.isAuthorized = true;
    this.throwEventAuthenticationStateChanged(this.isAuthorized)
  }

  handleLogout = () => {
    if(this.revoke){ this.revoke() }
    this.revoke = undefined
    this.isAuthorized = false;
    this.throwEventAuthenticationStateChanged(this.isAuthorized)
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

  throwEventAuthenticationStateChanged(authorized: boolean) {
    console.log("authenticationStateChanged")
    this.authenticationStateChanged.emit({authorized});
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