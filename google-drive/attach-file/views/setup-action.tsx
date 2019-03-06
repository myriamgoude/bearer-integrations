/*
  The purpose of this component is to save scenario credentials.
  This file has been generated automatically and should not be edited.
*/

import { RootComponent, State, Prop, t } from '@bearer/core'
import '@bearer/ui'

@RootComponent({
  group: 'setup',
  role: 'action'
})
export class SetupAction {
  @Prop() onSetupSuccess: (detail: any) => void = (_any: any) => {};
  @State() fields = [
    { type: 'text', label: t('setup.clientId', 'Client ID'), controlName: 'clientID' },
    { type: 'password', label: t('setup.clientSecret', 'Client Secret'), controlName: 'clientSecret' }
  ];
  render() {
    return (
        <bearer-setup onSetupSuccess={this.onSetupSuccess} scenarioId="BEARER_SCENARIO_ID" fields={this.fields} />
    )
  }
}
