import { Component, Prop } from '@bearer/core'
import { Forms } from '../types'
import ViewIcon from './icons/icon-view'

@Component({
  tag: 'form-display',
  styleUrl: 'form-display.css',
  shadow: true
})
export class FormDisplay {
  @Prop() items: Forms[]

  redirect = (form: Forms) => {
    window.open(`${form._links.display}`, '_blank')
  }

  render() {
    if (!this.items && !this.items.length) {
      return null
    }

    return this.items.map(form => {
      return (
        <li class='list-item'>
          <div>
            <p>
              Webhook URL successfully attached to <strong>{form.title}</strong>
            </p>
          </div>
          <a href={form._links.display} target='_blank' class='preview'>
            <ViewIcon />
          </a>
        </li>
      )
    })
  }
}
