import { Component, Prop } from '@bearer/core'
import IconView from '../icons/icon-view';
import IconSuccess from '../icons/icon-success';

@Component({
  tag: 'event-display',
  styleUrl: 'event-display.css',
  shadow: true
})
export class EventDisplay {
  @Prop() item: any = undefined;

  render() {
    return this.item ? <div class="event-created-msg">
      <IconSuccess />
      <span>Your event "{this.item.summary}" has been created</span>
      <a href={this.item.htmlLink} target="_blank">
        <IconView />
      </a>
    </div> : null;
  }
}
