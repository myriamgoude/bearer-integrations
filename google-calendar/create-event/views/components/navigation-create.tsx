import {Component, Prop, State} from "@bearer/core";
import {GoogleEvent} from "../types";

export type Data = {
    summary: string;
    date: string;
    startHour: string;
    endHour: string;
    location: string;
    email: string;
}

@Component({ tag: 'navigation-create', styleUrl: 'navigation-create.css' })
export class NavigationCreate {

    @Prop() onSubmitted: any;
    @State() event: GoogleEvent = {
        start: {dateTime: null},
        end: {dateTime: null},
        attendees: [],
        summary: '',
        location: ''
    };
    @State() form = {} as Data;

    handleSubmit = () => {
        this.event.start.dateTime = new Date(`${this.form.date} ${this.form.startHour}`);
        this.event.end.dateTime = new Date(`${this.form.date} ${this.form.endHour}`);
        this.event.summary = this.form.summary;
        this.event.location = this.form.location;
        this.event.attendees.push({
            email: this.form.email
        });
        this.onSubmitted(this.event);
    };

    handleChange(event, type) {
        this.form[type] = event.target.value;
    }

    render() {
        return (
            <form>
                <ul class="navigation-list">
                    <li class="list-item">
                        <span>Title</span>
                        <input type="text" value={this.form.summary} onInput={(event) => this.handleChange(event, 'summary')}/>
                    </li>
                    <li class="list-item">
                        <span>Date</span>
                        <input type="date" value={this.form.date} onInput={(event) => this.handleChange(event, 'date')}/>
                    </li>
                    <li class="list-item">
                        <span>Starting hour</span>
                        <input type="time" value={this.form.startHour} onInput={(event) => this.handleChange(event, 'startHour')}/>
                    </li>
                    <li class="list-item">
                        <span>Ending hour</span>
                        <input type="time" value={this.form.endHour} onInput={(event) => this.handleChange(event, 'endHour')}/>
                    </li>
                    <li class="list-item">
                        <span>Location</span>
                        <input type="text" value={this.form.location} onInput={(event) => this.handleChange(event, 'location')}/>
                    </li>
                    <li class="list-item">
                        <span>Attendees</span>
                        <input type="email" value={this.form.email} onInput={(event) => this.handleChange(event, 'email')}/>
                    </li>
                </ul>
                <bearer-button onClick={this.handleSubmit}>Save</bearer-button>
            </form>
        )
    }
}
