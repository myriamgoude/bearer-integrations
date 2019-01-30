/*
  The purpose of this component is to deal with scenario navigation between each views.

*/
import { RootComponent, State, Prop, Intent, BearerFetch, Element, EventEmitter, Event, Watch } from '@bearer/core'
import '@bearer/ui'
import 'ionicons'

const HIDE_NOTIFICAITON_AFTER = 5000

type MailList = {
  id: string
  name: string
}

type SubscriptionSucceeded = {
  email: string
  lists: MailList[]
}
type SubscriptionFailure = {
  error: string
}

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
  @Prop() listId: string = undefined

  @State() email: string = ''
  @State() error: string = undefined
  @State() subscribed: boolean = false
  @State() disabled: boolean = true
  @State() lists: MailList[] = undefined
  @State() messageTimeout:NodeJS.Timeout

  @Element() el: HTMLElement

  @Intent('subscribeUser') subscribeUser: BearerFetch
  @Intent('fetchMailLists') fetchMailLists: BearerFetch

  @Event()
  succeeded: EventEmitter<SubscriptionSucceeded>
  @Event()
  failed: EventEmitter<SubscriptionFailure>

  @Watch('error')
  notifyError(newValue: string, _oldValue: string) {
    if (newValue != undefined) {
      this.failed.emit({ error: this.error } as SubscriptionFailure)
    }
  }

  handleSubscribeMulti = (subscribe: MailList[]) => {
    clearTimeout(this.messageTimeout)
    const notification: SubscriptionSucceeded = {
      email: this.email,
      lists: subscribe
    }
    this.lists = undefined
    Promise.all(
      subscribe.map((list: MailList) => {
        return this.subscribeUser({
          list_id: list.id,
          email: encodeURIComponent(this.email)
        })
      })
    )
      .then(data => {
        if (data.length == 0) {
          this.error = 'No lists selected.'
          this.subscribed = false
          this.resetMessages();
        } else {
          this.succeeded.emit(notification)
          this.error = undefined
          this.subscribed = true
          this.resetMessages();
        }
      })
      .catch(this.handleSubscribeErrors)
  }
  handleSubmit = (e: Event) => {
    e.preventDefault()
    clearTimeout(this.messageTimeout)

    const notification: SubscriptionSucceeded = {
      email: this.email,
      lists: [
        {
          name: 'defualt',
          id: this.listId
        }
      ]
    }
    // Try to subscribe user
    this.subscribeUser({
      list_id: this.listId,
      email: encodeURIComponent(this.email)
    })
      .then(_data => {
        this.succeeded.emit(notification)
        this.error = undefined
        this.subscribed = true
        this.resetMessages();
      })
      .catch(this.handleSubscribeErrors)
  }

  //reset messages to default after user has had time to see
  resetMessages = () => {
    this.messageTimeout = setTimeout(() => {
      this.error = undefined
      this.subscribed = false
    }, HIDE_NOTIFICAITON_AFTER)
  }

  handleSubscribeErrors = (data: any) => {
    this.subscribed = false
    //console.log(data)
    // data.error contians reason that subscription failed could customise further here
    if (data.error && data.error.title) {
      switch (data.error.title) {
        case 'Member Exists':
          this.error = 'You are already subscribed.'
          break
        default:
          this.error = 'Unable to subscribe you.'
          break
      }
    } else {
      this.error = 'Unable to subscribe you.'
    }
    this.resetMessages();
  }

  componentDidLoad() {
    this.el.addEventListener('click', this.handleInternalClick)
    document.addEventListener('click', this.handleExternalClick)
  }

  handleExternalClick = (_e: Event) => {
    this.lists = undefined
  }
  handleInternalClick = (e: Event) => {
    e.stopImmediatePropagation()
  }

  handleSubmitMulti = (e: Event) => {
    e.preventDefault()
    this.fetchMailLists()
      .then(({ data }) => {
        this.lists = data as any
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleChange = (e:any) => {
    this.email = e.target.value
    this.disabled = this.email === ''
  }

  handleTooltip = () => {
    if (this.error) {
      return { 'data-tooltip': this.error, 'data-tooltip-type': 'danger' }
    } else if (this.subscribed) {
      return {
        'data-tooltip': 'You just subscribed! Thank you.',
        'data-tooltip-type': 'success'
      }
    } else {
      return {}
    }
  }

  render() {
    if (this.isSingleList()) {
      return this.renderForm(this.handleSubmit)
    }
    return (
      <div>
        {this.renderForm(this.handleSubmitMulti)}
        {this.renderSelection()}
      </div>
    )
  }

  renderForm = (joinHandler: (e: Event) => void) => {
    const tooltip = this.handleTooltip()
    return (
      <form onSubmit={joinHandler} class="form-group">
        <input type="email" value={this.email} placeholder="email@example.com" onInput={this.handleChange} />
        <button type="submit" {...tooltip} disabled={this.disabled}>
          <ion-icon name="mail" />
          Join our mailing list
        </button>
      </form>
    )
  }

  renderSelection = () => {
    if (this.lists === undefined) {
      return null
    }
    return (
      <workflow-box heading="Subscribe" style={{ position: 'absolute', paddingLeft: '10px' }}>
        <list-select attributeName="name" attributeHash="id" options={this.lists} onSave={this.handleSubscribeMulti} />
      </workflow-box>
    )
  }

  isSingleList = () => {
    return this.listId !== undefined
  }
}
