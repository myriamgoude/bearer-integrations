import { Component, Prop } from '@bearer/core'
import { Invoice } from '../types'
import IconDownload from '../icons/icon-download'
import IconTrash from '../icons/icon-trash'

@Component({
  tag: 'invoices-display',
  styleUrl: 'invoices-display.css',
  shadow: true
})
export class InvoicesDisplay {
  @Prop() items: Invoice[] = undefined
  @Prop() onDelete: (invoice: Invoice[]) => void | undefined

  handleRemovalClick(e: MouseEvent) {
    e.preventDefault()
    if (this.onDelete) {
      this.onDelete(this.items)
    }
  }

  convertDate = timestamp => {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const min = date.getMinutes()
    return `${day}.${month}.${year} at ${hour}:${min}`
  }

  render() {
    if (this.items.length === 0) {
      return null
    }

    return (
      <div class='content'>
        {this.onDelete ? (
          <span
            class='remove icon-inline icon-after'
            onClick={event => {
              this.handleRemovalClick(event)
            }}
          >
            REMOVE
            <IconTrash />
          </span>
        ) : null}
        <ol>
          {this.items.map(invoice => {
            return (
              <li class='list-item'>
                <div class='list-heading'>
                  <span class={'status-box' + ' ' + invoice.status}>{invoice.status.toUpperCase()}</span>
                  <strong class='invoice-number'>{invoice.number}</strong>
                </div>
                <div>
                  <strong class='price'>{(invoice.total / 100).toFixed(2)}$</strong>
                </div>
                <div>
                  Billed date : <strong>{this.convertDate(invoice.date)}</strong>
                </div>
                <div class='actions'>
                  <a href={invoice.invoice_pdf} target='_blank' class='download-link icon-inline icon-before'>
                    <IconDownload />
                    Download
                  </a>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }
}
