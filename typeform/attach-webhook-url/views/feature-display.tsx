import {Input, Output, RootComponent} from "@bearer/core";
import {Forms} from './types'

@RootComponent({
    role: 'display',
    group: 'feature'
})
export class FeatureDisplay {
    @Input() forms: Forms[] = [];
    @Output({
        intentName: 'saveForms',
        intentPropertyName: 'forms',
        intentReferenceIdKeyName: "referenceId"
    })
    displayedFiles: Forms[] = [];

    render() {
        return <form-display items={this.forms} />
    }
}
