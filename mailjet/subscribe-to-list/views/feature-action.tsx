/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import {RootComponent, State, Event, EventEmitter, Intent, BearerFetch, t, Prop} from '@bearer/core'
import '@bearer/ui'

export enum InterfaceState {
    Authenticated = 'Authenticated',
    Loading = 'Loading',
    Subscribe = 'Subscribe',
    Settings = 'Settings',
    Error = 'Error'
}

const StateTitles = {
    [InterfaceState.Loading]: 'Loading...',
    [InterfaceState.Subscribe]: 'Subscribe',
    [InterfaceState.Error]: 'Something went wrong',
    [InterfaceState.Settings]: 'Settings'
}

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {

    @Prop() listid: string;

    @State() ui: InterfaceState = InterfaceState.Authenticated
    @State() errorMessage: string | undefined
    @State() items: any[]
    @State() email: string = '';

    @Intent('fetchContactLists') fetchContactLists: BearerFetch
    @Intent('subscribeToList') subscribeToList: BearerFetch

    @Event({ eventName: 'subscribed' })
    subscribed: EventEmitter<any>

    handleSubmit = (selection) => {
        this.subscribeToList({listId: selection.map(item => item.id), email: this.email}).then(({data}) => {
            this.subscribed.emit({data, list: selection.map(item => item.name)});
            this.ui = InterfaceState.Authenticated;
            console.log(data)
        }).catch(this.handleError)
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

        if (this.listid) {
            this.ui = InterfaceState.Authenticated
            this.subscribeToList({listId: this.listid, email: this.email}).then(({data}) => {
                this.subscribed.emit({data, listFromProp: true});
            }).catch(this.handleError)
        } else {
            this.ui = InterfaceState.Loading
            this.fetchContactList()
        }
    }

    fetchContactList = () => {
        this.items = undefined
        this.errorMessage = undefined

        this.fetchContactLists()
            .then(({ data }: { data: File[] }) => {
                this.items = data
                this.ui = InterfaceState.Subscribe
            })
            .catch(this.handleError)
    }

    handleChange = (event) => {
        this.email = event.target.value
    }

    handleError = error => {
        this.ui = InterfaceState.Error
        this.errorMessage = error.error
    }

    handleExternalClick = (_e: Event) => {
        this.items = undefined
        this.ui = InterfaceState.Authenticated
    }



    handleMenu = () => {
        this.ui = InterfaceState.Settings
    }

    handleWorkflowBack = () => {
        switch (this.ui) {
            case InterfaceState.Settings:
            case InterfaceState.Subscribe:
                this.fetchContactList()
                break
            case InterfaceState.Error:
                this.ui = InterfaceState.Authenticated
                break
        }
    }

    render() {
        return (
            <div>
                <input type="text" onChange={e => this.handleChange(e)}/>
                <popover-screen
                    ui={this.ui}
                    heading={t(`headings.step-${this.ui}`, StateTitles[this.ui]) || ''}
                    errorMessage={this.errorMessage}
                    items={this.items}
                    handleBack={this.handleWorkflowBack}
                    handleClose={this.handleExternalClick}
                    handleMenu={this.ui == InterfaceState.Settings ? undefined : this.handleMenu}
                    handlePopoverToggler={this.togglePopover}
                    handleSubmit={this.handleSubmit}
                    handleRetry={this.handleRetry}
                />
            </div>
        )
    }
}
