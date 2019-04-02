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
                    <input required name="name" type="text" placeholder="Enter company name"/>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <input name="description" type="text" placeholder="Description"/>
                </div>
            </form>
        )
    }

    renderContactForm() {
        return (
            <form id="contactForm">
                <div class="form-group">
                    <label>First name</label>
                    <input required name="firstname" type="text" placeholder="Enter first name"/>
                </div>

                <div class="form-group">
                    <label>Last name</label>
                    <input required name="lastname" type="text" placeholder="Enter last name"/>
                </div>

                <div class="long-form-group">
                    <label>Email</label>
                    <input required name="email" type="text" placeholder="Enter email"/>
                </div>

                <div class="form-group">
                    <label>Website</label>
                    <input name="website" type="text" placeholder="Enter website address"/>
                </div>

                <div class="form-group">
                    <label>Company</label>
                    <input name="company" type="text" placeholder="Enter name"/>
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input name="phone" type="text" placeholder="Enter phone number"/>
                </div>

                <div class="long-form-group">
                    <label>Address</label>
                    <input class="one-line-element" name="address" type="text" placeholder="Enter address"/>
                </div>

                <div class="form-group">
                    <label>City</label>
                    <input name="city" type="text" placeholder="Enter city"/>
                </div>

                <div class="form-group">
                    <label>State</label>
                    <input name="state" type="text" placeholder="Enter state"/>
                </div>

                <div class="form-group">
                    <label>Zip</label>
                    <input name="zip" type="text" placeholder="Zip"/>
                </div>
            </form>
        )
    }

    renderDealForm() {
        return (
            <form id="dealForm">
                <div class="form-group">
                    <label>Deal name</label>
                    <input class="label-input" required name="dealname" type="text" placeholder="Enter name"/>
                </div>
                <div class="form-group">
                    <label>Deal stage</label>
                    <select class="select-bar" required name="dealstage">
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
                    <input placeholder="Type in a number" name="amount" type="number"/>
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
            <bearer-button class="btn-position" onClick={this.handleSave}>Save</bearer-button>
            ]
    }
}
