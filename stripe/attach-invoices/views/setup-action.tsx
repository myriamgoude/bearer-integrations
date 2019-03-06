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
    { type: 'password', label: t('setup.apiKey', 'Api Key'), controlName: 'apiKey' }
  ];
  @State() innerListener = `setup_success:BEARER_SCENARIO_ID`;
  render() {
    return (
        <bearer-dropdown-button innerListener={this.innerListener}>
          <span slot="dropdown-btn-content">Setup component</span>
          <bearer-setup onSetupSuccess={this.onSetupSuccess} scenarioId="BEARER_SCENARIO_ID" fields={this.fields} />
        </bearer-dropdown-button>
    )
  }
}
