/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import { RootComponent, EventEmitter, Event, Input, Output } from '@bearer/core'
import '@bearer/ui'

// We import the PullRequest type from types.ts
import { PullRequest } from './types'

@RootComponent({
  group: 'edit',
  role: 'action'
})
export class EditAction {
  // Input is named pullRequests and is an Array of PullRequest
  @Input({
    group: 'feature'
  })
  pullRequests: PullRequest[] = []
  @Output({
    intentName: 'savePullRequests',
    intentPropertyName: 'pullRequests',
    intentReferenceIdKeyName: "referenceId"
  })
  displayedPullRequest: PullRequest[] = []

  @Event({ eventName: "removed", bubbles: true })
  removed: EventEmitter<PullRequest>

  handleRemove = (pr: PullRequest) => {
    (this as any).displayedPullRequestRefId = (this as any).pullRequestsRefId
    const updatedList = this.pullRequests.filter((elm: PullRequest) => pr.id !== elm.id)
    this.pullRequests = [...updatedList]
    this.displayedPullRequest = [...updatedList]
    this.removed.emit(pr)
  }

  render() {
    return <pull-display items={this.pullRequests} onDelete={this.handleRemove} />
  }
}
