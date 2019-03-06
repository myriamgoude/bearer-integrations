import { Prop, Intent,BearerFetch, RootComponent, State, Watch } from "@bearer/core";
import { Invoice } from "./types";
import { Listen } from "@stencil/core";


@RootComponent({
    role: 'display',
    group: 'feature'
})
export class FeatureDisplay {

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
            }).catch(console.error) // TODO - gently handle errors
    }

    @Watch("customerId")
    onChangeCustomerId() { this.fetchInvoices() }

    render() {
        if (!this.customerId) { this.invoices = []; }
        return <invoices-display items={this.invoices} />
    }
}
