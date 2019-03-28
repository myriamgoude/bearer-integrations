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
                    if (item.value && this.entry.properties[item.name]) {
                        item.same = item.value === this.entry.properties[item.name].value;
                    }
                    break;
                case 'contact':
                    if (item.value && this.entry.properties[item.property]) {
                        item.same = item.value === this.entry.properties[item.property].value;
                    }
                    break;
            }
        })
    }

    handleInput = (e, name) => {
        this.updateEntry.properties.map(item => {
            if (item.name === name) {
                item.value = e.target.value;
            }
        })
    };

    handleContactInput = (e, name) => {
        this.updateEntry.properties.map(item => {
            if (item.property === name) {
                item.value = e.target.value;
            }
        })
    };

    renderDealForm() {
        return (
            this.updateEntry.properties.map(prop => (
                <div class="content">
                    <div class="label">
                        {prop.same ? <div class="white-dot"></div> : <div class="green-dot"></div>}
                        <label class="capital-letter">{prop.name}</label>
                    </div>
                    {prop.same ? <span>{this.entry.properties[prop.name].value}</span> : <div class="values">
                        {this.entry.properties[prop.name] ? <span class="previous-value">{this.entry.properties[prop.name].value}</span> : null}
                       <input placeholder="Enter new value" class="value" value={prop.value} onInput={event => this.handleInput(event, prop.name)}/>
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
                        {prop.same ? <div class="white-dot"></div> : <div class="green-dot"></div>}
                        <label class="capital-letter">{prop.property}</label>
                    </div>
                    {prop.same ? <span>{this.entry.properties[prop.property].value}</span> : <div class="values">
                        {this.entry.properties[prop.property] ? <span class="previous-value">{this.entry.properties[prop.property].value}</span> : null}
                        <input placeholder="Enter new value" class="value" value={prop.value} onInput={event => this.handleContactInput(event, prop.property)} />
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
                        {prop.same ? <div class="white-dot"></div> : <div class="green-dot"></div>}
                        <label class="capital-letter">{prop.name}</label>
                    </div>
                    {prop.same ? <span>{this.entry.properties[prop.name].value}</span> : <div class="values">
                        {this.entry.properties[prop.name] ? <span class="previous-value">{this.entry.properties[prop.name].value}</span> : null}
                        <input placeholder="Enter new value" class="value" value={prop.value} onInput={event => this.handleInput(event, prop.name)}/>
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
            <div class="btn-position">
                <bearer-button onClick={this.onSubmitted}>Update</bearer-button>
            </div>
        ]
    }
}
