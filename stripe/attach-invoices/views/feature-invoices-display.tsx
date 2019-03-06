// import { Prop, Intent,BearerFetch, RootComponent, State, Watch} from "@bearer/core";
// import { Invoice } from "./types";


// @RootComponent({
//     role: 'display',
//     group: 'feature-invoices'
// })
// export class FeatureInvoicesDisplay {

//     @Intent('listInvoices') listInvoices: BearerFetch;
//     @Prop({reflectToAttr: true, mutable: true}) customerId: string;
//     @Prop() authId: string;

//     @State() invoices: Invoice[];

//     fetchInvoices = () => {
//         if (!this.customerId || this.customerId === "") {
//             this.invoices = []; // TODO - gently handle errors
//             return;
//         }
        
//         this.listInvoices({ authId: this.authId, customerId: this.customerId })
//             .then((data) => {
//                 this.invoices = data.data;
//             }).catch((err) => { console.error("listInvoices", err) }) // TODO - gently handle errors
//     }

//     @Watch("customerId")
//     onChangeCustomerId() { this.fetchInvoices() }

//     render() {
//         if (!this.customerId) { this.invoices = []; }
//         return <invoices-display items={this.invoices} />
//     }
// }
