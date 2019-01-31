import { Component, Prop } from '@bearer/core'
import { PullRequest } from '../types';

const link = (link: string, label: string) => {
  return <a href={link} rel='nofollow' target='_blank'>{label}</a>
}

@Component({
  tag: 'pull-display',
  styleUrl: 'pull-display.css',
  shadow: true,
})
export class IconChevron {
  @Prop() onDelete: (pr:PullRequest) => void | undefined
  @Prop() items: PullRequest[]

  render() {
    if (!this.items && !this.items.length) {
      return null;
    }

    return (
      <ul>
        {this.items.map(pr => {
          return (<li>
              <div class='detail'>
                <h4>{link(pr.url, pr.title)}</h4>
                <p><span>#{pr.number}</span> opened by {link(pr.author.url, pr.author.login)}</p>
                <p style={{color:'#8A8FA2'}}>
                  Merge <span class='highlight'>{pr.headRefName}</span> into <span class='highlight'>{pr.baseRefName}</span>
                </p>
              </div>
              <div class='options'>
                {(pr.comments.totalCount >0) ?<a href={`${pr.url}/comments`} rel='nofollow' target='_blank'><ion-icon name="chatbubbles"></ion-icon><span>{pr.comments.totalCount}</span></a> : <a/>}
                {(this.onDelete) ? this.renderDelete(pr) : null }
              </div>
            </li>)
        })}
      </ul>
    )
  }

  renderDelete = (pr: PullRequest) => {
    const handler = (e:Event) => {
      e.preventDefault()
      this.onDelete(pr)
    }
    return(
      <a href='#' onClick={handler} class='remove'><span>remove</span><ion-icon name="trash"></ion-icon></a>
    )
  }
}
