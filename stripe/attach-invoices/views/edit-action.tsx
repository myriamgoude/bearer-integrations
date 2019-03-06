import '@bearer/ui'
import {BearerFetch, Intent, Prop, State, Listen, RootComponent, Watch} from '@bearer/core'
import { Invoice } from './types'

@RootComponent({
    role: 'action',
    group: 'edit'
})
export class EditAction {
    
    @Intent('listInvoices') listInvoices: BearerFetch;
    @Prop({reflectToAttr: true, mutable: true}) customerId: string;
    @Prop() authId: string;

    @State() invoices: Invoice[];
    
    @Listen("body:feature:attachedCustomer")
    attachedCustomerHandler (e: CustomEvent) {
        const customer = (e.detail.customer) ? e.detail.customer : undefined;
        const externalAuthId = (e.detail.authId) ? e.detail.authId : undefined;

        if (this.authId === externalAuthId) {
            this.customerId = customer.id;            
        }
    }

    fetchInvoices = () => {
        if (!this.customerId || this.customerId === "") {
            this.invoices = []; // TODO - gently handle errors
            return;
        }
        
        this.listInvoices({ authId: this.authId, customerId: this.customerId })
            .then((data) => {
                this.invoices = data.data;
            }).catch((err) => { console.error("listInvoices", err) }) // TODO - gently handle errors
    }

    @Watch("customerId")
    onChangeCustomerId() { this.fetchInvoices() }

    handleRemove = () => {
        this.invoices = [];
        // this.removed.emit(this.invoices);
    };

    render() {
        if (!this.customerId) { this.invoices = []; }
        return <invoices-display items={this.invoices} onDelete={this.handleRemove} />
    }
}
