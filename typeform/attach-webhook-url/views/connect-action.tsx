/*
  The purpose of this component is to deal with scenario navigation between each views.
*/

import Bearer, { RootComponent, Event, Events, EventEmitter, Prop, Element, State } from '@bearer/core'
import '@bearer/ui'

export type TAuthorizedPayload = { authId: string }

import { TAuthSavedPayload } from './types'

@RootComponent({
  role: 'action',
  group: 'connect',
  shadow: false
})
export class ConnectAction {
  @Event()
  authorized: EventEmitter<TAuthorizedPayload>
  @Event()
  revoked: EventEmitter<TAuthorizedPayload>

  providerName = "Typeform"
  @Prop() textUnauthenticated: string = "Connect to " + this.providerName 
  @Prop() textAuthenticated: string = "Disconnect from " + this.providerName 
  @Prop() kind: string = "embed"
  @Prop() icon: string

  @Prop({ mutable: true }) authId: string = null

  @State()
  authIdInternal: string
  @Element()
  el: HTMLElement

  componentDidLoad() {
    this.authIdInternal = this.authId
    Bearer.emitter.addListener(Events.AUTHORIZED, ({ data }: { data: TAuthSavedPayload }) => {
      const authId = data.authId || (data as any).authIdentifier
      this.authId = this.authIdInternal = authId
      this.authorized.emit({ authId })
    })

    Bearer.emitter.addListener(Events.REVOKED, (_payload: { data: TAuthSavedPayload }) => {
      this.authIdInternal = this.authId = null
      this.revoked.emit()
    })
  }

  renderUnauthorized = ({ authenticate }) => (<icon-button onClick={authenticate} text={this.textUnauthenticated} />)

  renderUnauthorizedIfAuthId = () => this.authIdInternal && this.renderUnauthorized({ authenticate: this.authenticate })

  authenticate = () => {
    this.el.querySelector('bearer-authorized').authenticate(this.authId)
  }

  render() {
    return [
      <bearer-authorized
        renderUnauthorized={this.renderUnauthorizedIfAuthId}
        renderAuthorized={({ revoke }) =>
          this.authIdInternal && (<icon-button text={this.textAuthenticated} onClick={revoke}/>)
        }
      />,
      !this.authIdInternal && this.renderUnauthorized({ authenticate: this.authenticate })
    ]
  }
}