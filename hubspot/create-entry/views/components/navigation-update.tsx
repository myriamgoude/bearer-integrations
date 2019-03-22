import {Component, Prop} from "@bearer/core";

@Component({ tag: 'navigation-update', styleUrl: 'navigation-update.css' })
export class NavigationUpdate {
    @Prop() updateEntry: any;
    @Prop() entry: any;
    @Prop() onSubmitted: any;

    compareEntry() {
        this.updateEntry.properties.forEach(item => {
            switch (this.updateEntry.type) {
                case 'deal':
                case 'company':
                    if (item.value) {
                        item.same = item.value === this.entry.properties[item.name].value;
                    }
                    break;
                case 'contact':
                    if (item.value) {
                        item.same = item.value === this.entry.properties[item.property].value;
                    }
                    break;
            }
        })
    }

    renderDealForm() {
        return (
            this.updateEntry.properties.map(prop => (
                <div class="content">
                    <div class="label">
                        {prop.same ? null : <div class="green-dot"></div>}
                        <label>{prop.name}</label>
                    </div>
                    {prop.same ? <span>{this.entry.properties[prop.name].value}</span> : <div class="values">
                        <span class="previous-value">{this.entry.properties[prop.name].value}</span>
                        <span class="value">{prop.value}</span>
                    </div>}
                </div>
            ))
        )
    }

    renderContactForm() {
        return (
            this.updateEntry.properties.map(prop => (
                <div class="content">
                    <div class="label">
                        {prop.same ? null : <div class="green-dot"></div>}
                        <label>{prop.name}</label>
                    </div>
                    {prop.same ? <span>{this.entry.properties[prop.name].value}</span> : <div class="values">
                        <span class="previous-value">{this.entry.properties[prop.property].value}</span>
                        <span class="value">{prop.value}</span>
                    </div>}
                </div>
            ))
        )
    }

    renderCompanyForm() {
        return (
            this.updateEntry.properties.map(prop => (
                <div class="content">
                    <div class="label">
                        {prop.same ? null : <div class="green-dot"></div>}
                        <label>{prop.name}</label>
                    </div>
                    {prop.same ? <span>{this.entry.properties[prop.name].value}</span> : <div class="values">
                        <span class="previous-value">{this.entry.properties[prop.name].value}</span>
                        <span class="value">{prop.value}</span>
                    </div>}
                </div>
            ))
        )
    }

    renderContent() {
        switch (this.updateEntry.type) {
            case 'deal':
                return this.renderDealForm();
            case 'contact':
                return this.renderContactForm();
            case 'company':
                return this.renderCompanyForm();
        }
    }

    render() {
        this.compareEntry()
        return [this.renderContent(),
        <bearer-button onClick={this.onSubmitted}>Update</bearer-button>]
    }
}
