/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import Bearer, {BearerFetch, Element, Event, Events, EventEmitter, Intent, Output, Prop, RootComponent, State} from '@bearer/core';
import '@bearer/ui';
import { Customer } from "./types";

import IconSettings from "./components/icons/icon-settings";
import IconClose from "./components/icons/icon-close";

export type TAuthorizedPayload = { authId: string }

enum InterfaceState {
    Unauthenticated,
    Authenticated,
    Users,
    Settings,
    Error,
}

const StateTitles = {
    [InterfaceState.Users]: 'Select User',
    [InterfaceState.Error]:'Select User',
    [InterfaceState.Settings]:'Settings',
};

@RootComponent({
    role: 'action',
    group: 'feature'
})
export class FeatureAction {
    @Prop() autoClose: boolean = true;
    @Prop() authId: string;
    @Prop() customerid: string;

    @Intent('listData') getData: BearerFetch;
    @Intent('searchData') searchData: BearerFetch;

    @State() ui: InterfaceState = InterfaceState.Unauthenticated;
    @State() errorMessage: string | undefined;
    @State() isAuthorized: boolean = false;
    @State() openPopoverOnceLoggedIn: boolean = false

    @State() formsData: Customer[] | undefined;
    @State() selectedCustomer: Customer | undefined;
    @State() formsSearchResults: Customer[] | undefined;

    @Output() invoices: any[];

    @Element() el: HTMLElement;

    @Event() authorized: EventEmitter<TAuthorizedPayload>
    @Event() revoked: EventEmitter<TAuthorizedPayload>
    @Event() attachedCustomer: EventEmitter

    handleRetry = () => {
        this.ui = InterfaceState.Authenticated;
        this.handleAttachClick()
    };

    handleAttachClick = () => {
        if(this.ui > InterfaceState.Authenticated){
            this.ui = InterfaceState.Authenticated;
            return
        }
        this.selectedCustomer = undefined;
        this.errorMessage = undefined;
        this.ui = InterfaceState.Users;
        this.getData({ authId: this.authId })
            .then(({data}:{data: Customer[]}) => {
                this.formsData = data;
            }).catch(this.handleError)
            
    };

    handleSearchQuery = (query: string) => {
        this.formsData = undefined;
        this.formsSearchResults = undefined;
        const req = (query.length > 3) ? this.searchData({authId: this.authId, query}) : this.getData({ authId: this.authId });
        req.then(({data}: {data: Customer[]}) => {
            this.formsSearchResults = data;
        }).catch(this.handleError);
    };

    handleError = error => {
        this.ui = InterfaceState.Error;
        this.errorMessage = error.error;
    };

    handleWorkflowBack = () => {
        switch(this.ui) {
            case InterfaceState.Users:
                break;
            case InterfaceState.Settings:
                this.ui = InterfaceState.Users;
                break;
            case InterfaceState.Error:
                this.ui = InterfaceState.Authenticated;
                break;
        }
    };

    attachCustomer = (customer: Customer) => {
        
        this.attachedCustomer.emit({customer});

        this.selectedCustomer = customer;
        this.ui = InterfaceState.Authenticated;
    };

    handleMenu = () => {
        this.ui = InterfaceState.Settings
    };

    handleLogout = () => {
        this.ui = InterfaceState.Unauthenticated
    };

    renderUnauthorized: any = () => (
        <connect-action text-unauthenticated="Get invoices" onClick={() => { this.openPopoverOnceLoggedIn = true; }}/>
    )

    renderAuthorized: any = () => {

        if (this.openPopoverOnceLoggedIn) {
            this.openPopoverOnceLoggedIn = false;
            this.handleAttachClick();
        }

        return (
            <bearer-popover opened={this.ui > InterfaceState.Authenticated}>
                <icon-button slot="popover-toggler" onClick={this.handleAttachClick} text="Get invoices" />
                {this.renderWorkflow()}
            </bearer-popover>
        )
    };

    renderWorkflow = () => {

        if(this.ui <= InterfaceState.Authenticated) {
            return null;
        }
    
        const heading = StateTitles[this.ui] || "";
        const subHeading = undefined;
        const handleBack = (this.ui === InterfaceState.Settings) && this.handleWorkflowBack;
        const handleClose = this.handleExternalClick;
        const handleMenu = (this.ui == InterfaceState.Settings) ? undefined : this.handleMenu;

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
                {(handleMenu) && <button class='popover-control' onClick={handleMenu}><IconSettings/></button>}
                {(handleClose) && <button class='popover-control' onClick={handleClose}><IconClose/></button>}
                </div>
            </div>,
            <div style={{width: "300px"}}>{this.renderWorkflowContent()}</div>
        ]
    };

    renderWorkflowContent = () => {
        switch(this.ui){
            case InterfaceState.Error:
                return <error-message
                    message={this.errorMessage}
                    onRetry={this.handleRetry}
                />;
            case InterfaceState.Settings:
                return <connect-action
                    onClick={this.handleLogout}
                    authId={this.authId}
                    text-authenticated="Logout"
                    icon="ios-log-out"
                />;
            case InterfaceState.Users:
                const options = (this.formsSearchResults && this.formsSearchResults.length !== 0) ? this.formsSearchResults : this.formsData
                return (
                    <list-navigation
                        options={options}
                        attributeName={'email'}
                        onSearchQuery={this.handleSearchQuery}
                        onSubmitted={this.attachCustomer}
                        // onSubmitted={this.fetchInvoices}
                        showNextIcon={true}
                    />
                );
        }
        return null
    };

    handleExternalClick = (_e:Event) => {
        this.formsData = undefined;
        this.selectedCustomer = undefined;
        this.formsSearchResults = undefined;
        if(this.ui != InterfaceState.Unauthenticated){
            this.ui = InterfaceState.Authenticated
        }
    };

    handleInternalClick = (e:Event) => {
        e.stopImmediatePropagation()
    };

    componentDidLoad() {
        this.el.addEventListener("click", this.handleInternalClick);
        document.addEventListener("click", this.handleExternalClick);

        Bearer.emitter.addListener(Events.AUTHORIZED, () => {
            this.isAuthorized = true;
            if (this.ui < InterfaceState.Authenticated) {
                this.ui = InterfaceState.Authenticated;
            }
        })

        Bearer.emitter.addListener(Events.REVOKED, () => {
            this.isAuthorized = false;
            this.ui = InterfaceState.Unauthenticated;
        })
    }

    render() {
        return ( this.isAuthorized ? this.renderAuthorized() : this.renderUnauthorized() )
    }
}
