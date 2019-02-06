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
  @State() isPopoverOpened: boolean = false

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
    this.lists = undefined
    this.isPopoverOpened = false;

    clearTimeout(this.messageTimeout)
    const notification: SubscriptionSucceeded = {
      email: this.email,
      lists: subscribe
    }
    
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
          name: 'default',
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
    // data.error contains reason that subscription failed could customise further here
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
    this.isPopoverOpened = false;
  }
  handleInternalClick = (e: Event) => {
    e.stopImmediatePropagation()
  }

  handlePopoverOpening = (e: Event) => {
    this.isPopoverOpened = true;
    e.preventDefault()
    this.fetchMailLists()
      .then(({ data }) => {
        this.lists = data as any
      })
      .catch(err => {
        console.error(err)
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
    return [
      <form onSubmit={this.isSingleList() ? this.handleSubmit : null} class="form-group">
        <input type="email" value={this.email} placeholder="email@example.com" onInput={this.handleChange}/>
        {this.isSingleList() ? this.renderSingle() : this.renderSelection()}
      </form>
    ]
  }

  renderSingle = () => (
    <bearer-button {...this.handleTooltip()} type="submit" onClick={this.handleSubmit} disabled={this.disabled}>
      <ion-icon name="mail" />
      Join our mailing list
    </bearer-button>
  )

  renderSelection = () => {
    return (
      <bearer-popover opened={this.isPopoverOpened}>
        <bearer-button onClick={this.handlePopoverOpening} slot="popover-button" type="submit" {...this.handleTooltip()} disabled={this.disabled}>
          <ion-icon name="mail" />
          Join our mailing list
        </bearer-button>
        <workflow-box heading="Subscribe">
          <list-select attributeName="name" attributeHash="id" options={this.lists} handleSubmit={this.handleSubscribeMulti} />
        </workflow-box>
      </bearer-popover> 
    )
  }

  isSingleList = () => {
    return this.listId !== undefined
  }
}
