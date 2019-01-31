/*
  The purpose of this component is to be the result of your scenario.
  Its responsibility is to retrieve the scenario state from a previous action
  of a user.
*/
import { RootComponent, Input } from '@bearer/core'
import '@bearer/ui'

// We import the PullRequest type from types.ts
import { PullRequest } from './types'

@RootComponent({
  group: 'feature',
  role: 'display'
})
export class FeatureDisplay {
  // Input is named pullRequests and is an Array of PullRequest
  @Input() pullRequests: PullRequest[] = []

  render() {
    return <pull-display items={this.pullRequests}/>
  }
}
