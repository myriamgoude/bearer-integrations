import { Component, Prop, State, t } from '@bearer/core'
import { GoogleEvent } from '../types'

export type Data = {
  summary: string
  date: string
  startHour: string
  endHour: string
  location: string
  attendees: string
}

@Component({ tag: 'navigation-create', styleUrl: 'navigation-create.css' })
export class NavigationCreate {
  @Prop() onSubmitted: any
  @State() event: GoogleEvent = {
    start: { dateTime: null },
    end: { dateTime: null },
    attendees: [],
    summary: '',
    location: ''
  }
  @State() form = {} as Data

  constructor() {
    const now = new Date()
    this.form.startHour = `${now.getHours() + 1}:00`
    // this.form.startHour = `Pick an hour`
    this.form.endHour = `${now.getHours() + 2}:00`
    // this.form.date = `${now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay()}`
    this.form.date = `2019-12-12`
    console.log("TUTEJ " + this.form.date)

  }

  handleSubmit = () => {
    this.event.start.dateTime = new Date(`${this.form.date} ${this.form.startHour}`)
    this.event.end.dateTime = new Date(`${this.form.date} ${this.form.endHour}`)
    this.event.summary = this.form.summary

    if (this.event.location) {
      this.event.location = this.form.location
    }

    if (this.form.attendees) {
      this.event.attendees = this.form.attendees.split(',').map(attendee => {
        return { email: attendee }
      })
    }

    this.onSubmitted(this.event)
  }

  handleChange(event, type) {
    this.form[type] = event.target.value
  }

  render() {
    return (
      <form>
        <ul class='navigation-form'>
          <li class='navigation-form-group'>
            <span>{t('form.title', 'Title')}</span>
            <input type='text' value={this.form.summary} onInput={event => this.handleChange(event, 'summary')} placeholder="Name of the event" />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.date', 'Date')}</span>
            <input id="datePicker" type='date' value={this.form.date} onInput={event => this.handleChange(event, 'date')} />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.date_starting_hour', 'Starting hour')}</span>

            <input type='time' value={this.form.startHour} onInput={event => this.handleChange(event, 'startHour')} placeholder="Pick an hour" />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.date_ending_hour', 'Ending hour')}</span>
            <input type='time' value={this.form.endHour} onInput={event => this.handleChange(event, 'endHour')} placeholder="Pick an hour" />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.location', 'Location')}</span>
            <input type='text' value={this.form.location} onInput={event => this.handleChange(event, 'location')} placeholder="Location and/or link" />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.attendees', 'Attendees')}</span>
            <input type='email' value={this.form.attendees} onInput={event => this.handleChange(event, 'attendees')} placeholder="fill in emails" />
          </li>
        </ul>
        <div class="btn-position">
          <bearer-button onClick={this.handleSubmit}>{t('form.create', 'Save')}</bearer-button>
        </div>
      </form>
    )
  }
}
