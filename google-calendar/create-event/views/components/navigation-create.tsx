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
    this.form.endHour = `${now.getHours() + 2}:00`
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
            <input type='text' value={this.form.summary} onInput={event => this.handleChange(event, 'summary')} />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.date', 'Date')}</span>
            <input type='date' value={this.form.date} onInput={event => this.handleChange(event, 'date')} />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.date_starting_hour', 'Starting hour')}</span>

            <input type='time' value={this.form.startHour} onInput={event => this.handleChange(event, 'startHour')} />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.date_ending_hour', 'Ending hour')}</span>
            <input type='time' value={this.form.endHour} onInput={event => this.handleChange(event, 'endHour')} />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.location', 'Location')}</span>
            <input type='text' value={this.form.location} onInput={event => this.handleChange(event, 'location')} />
          </li>
          <li class='navigation-form-group'>
            <span>{t('form.attendees', 'Attendees')}</span>
            <input type='email' value={this.form.attendees} onInput={event => this.handleChange(event, 'attendees')} />
          </li>
        </ul>
        <bearer-button onClick={this.handleSubmit}>{t('form.create', 'Save')}</bearer-button>
      </form>
    )
  }
}
