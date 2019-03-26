import {Element, Component, Prop, State} from "@bearer/core";

export enum Type {
    Contact = 'contact',
    Deal = 'deal',
    Company = 'company'
}

@Component({ tag: 'navigation-create', styleUrl: 'navigation-create.css' })
export class NavigationCreate {

    @Prop() onSubmitted: any;
    @State() selectValue: string = Type.Deal;

    @Element() el: HTMLElement;

    handleSelect(e) {
        this.selectValue = e.target.value;
    }

    handleSave = () => {
        const form = this.el.querySelector(`#${this.selectValue}Form`);
        const obj = {
            properties: []
        };
        const values = Object.values(form).filter(item => item.value !== '');
        values.pop();
        values.forEach(item => {
            if (this.selectValue === 'contact') {
                obj.properties.push({
                    property: item.name,
                    value: item.value
                })
            } else {
                obj.properties.push({
                    name: item.name,
                    value: item.value
                })
            }
        });
        this.onSubmitted({type: this.selectValue, body: obj})
    }

    renderContent() {
        switch (this.selectValue) {
            case Type.Company:
                return this.renderCompanyForm();
            case Type.Contact:
                return this.renderContactForm();
            case Type.Deal:
                return this.renderDealForm();
        }
    }

    renderCompanyForm() {
        return (
            <form id="companyForm">
                <div class="form-group">
                    <label>Company name</label>
                    <input required name="name" type="text"/>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <input name="description" type="text"/>
                </div>
            </form>
        )
    }

    renderContactForm() {
        return (
            <form id="contactForm">
                <div class="form-group">
                    <label>First name</label>
                    <input required name="firstname" type="text"/>
                </div>

                <div class="form-group">
                    <label>Last name</label>
                    <input required name="lastname" type="text"/>
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input required name="email" type="text"/>
                </div>

                <div class="form-group">
                    <label>Website</label>
                    <input name="website" type="text"/>
                </div>

                <div class="form-group">
                    <label>Company</label>
                    <input name="company" type="text"/>
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input name="phone" type="text"/>
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <input name="address" type="text"/>
                </div>

                <div class="form-group">
                    <label>City</label>
                    <input name="city" type="text"/>
                </div>

                <div class="form-group">
                    <label>State</label>
                    <input name="state" type="text"/>
                </div>

                <div class="form-group">
                    <label>Zip</label>
                    <input name="zip" type="text"/>
                </div>
            </form>
        )
    }

    renderDealForm() {
        return (
            <form id="dealForm">
                <div class="form-group">
                    <label>Deal name</label>
                    <input required name="dealname" type="text"/>
                </div>
                <div class="form-group">
                    <label>Deal stage</label>
                    <select required name="dealstage">
                        <option value="appointmentscheduled">Appointment Scheduled</option>
                        <option value="qualifiedtobuy">Qualified To Buy</option>
                        <option value="presentationscheduled">Presentation Scheduled</option>
                        <option value="decisionmakerboughtin">Decision Maker Bought-In</option>
                        <option value="contractsent">Contract Sent</option>
                        <option value="closedwon">Closed Won</option>
                        <option value="closedlost">Closed Lost</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Amount</label>
                    <input name="amount" type="number"/>
                </div>
            </form>
        )
    }

    render() {
        return [
            <form>
                <div class="form-group">
                    <label>Type</label>
                    <select onInput={(event) => {this.handleSelect(event)}}>
                        <option value="deal" selected={this.selectValue === 'deal'}>Deal</option>
                        <option value="company" selected={this.selectValue === 'company'}>Company</option>
                        <option value="contact" selected={this.selectValue === 'contact'}>Contact</option>
                    </select>
                </div>
            </form>,
            this.renderContent(),
            <bearer-button onClick={this.handleSave}>Save</bearer-button>
            ]
    }
}
