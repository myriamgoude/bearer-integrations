import {Component, Prop, t} from '@bearer/core'
import IconNoResults from '../icons/icon-no-results'
import IconPath from '../icons/icon-path'
import {NavigationItem} from '../types'

@Component({tag: 'navigation-list', styleUrl: 'navigation-list.css'})
export class NavigationList {
    @Prop() multi: boolean;
    @Prop() items: NavigationItem[]
    @Prop() onSubmitted: any

    handleSubmit(selection: NavigationItem) {
        if (this.onSubmitted) {
            this.onSubmitted(selection)
        }
    }

    parseDate = event => {
        if (event.start) {
            const date = new Date(event.start.dateTime);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const min = date.getMinutes();
            return `${day}/${month}/${year} at ${hour}:${min}`;
        }
    };

    renderContents() {
        if (!this.items) {
            return <navigation-loader/>
        }

        if (this.items.length == 0) {
            return (
                <div class='no-results-content'>
                    <div class='no-results-icon'>
                        <IconNoResults/>
                    </div>
                    <span class='no-results-label'>{t('state.empty_results', 'No data found')}</span>
                </div>
            )
        }

        return (
            <ul class='navigation-list'>
                {this.items.map(item => (
                    <li class='navigation-item' onClick={() => {
                        this.handleSubmit(item)
                    }}>
                        <div class="event-info">
                            <span class='label'>{item.summary}</span>
                            {item['start'] ? <span class="date">{this.parseDate(item)}</span> : null}
                        </div>
                        {this.multi ? <IconPath/> : null}
                    </li>
                ))}
            </ul>
        )
    }

    render() {
        return <div class='scroll'>{this.renderContents()}</div>
    }
}
