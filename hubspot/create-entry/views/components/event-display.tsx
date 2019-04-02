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

  getLink = () => {
    let id = `${this.item.type}Id`;
    if (this.item.type === 'contact') {
      return this.item.data['profile-url']
    }
    return `https://app.hubspot.com/contacts/${this.item.data.portalId}/${this.item.type}/${this.item.data[id]}`
  };

  renderMessage = () => {
    switch (this.item.type) {
      case 'company':
        return `${this.item.data.properties.name.value}`;
      case 'deal':
        return `${this.item.data.properties.dealname.value}`;
      case 'contact':
        return `${this.item.data.properties.firstname.value} ${this.item.data.properties.lastname.value}`;
    }
  }

  render() {
    return this.item ? <div class="event-created-msg">
      <IconSuccess />
      {this.item.updated ? <span>Your {this.item.type} "<strong>{this.renderMessage()}</strong>" has been updated</span> : <span>Your {this.item.type} "<strong>{this.renderMessage()}</strong>" has been created</span>}
      <a href={this.getLink()} target="_blank">
        <IconView />
      </a>
    </div> : null;
  }
}
