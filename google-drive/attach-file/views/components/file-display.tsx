import {Component, Prop} from '@bearer/core'
import {File} from '../types'

@Component({
    tag: 'file-display',
    styleUrl: 'file-display.css',
    shadow: true
})
export class FileDisplay {
    @Prop() onDelete: (file: File) => void | undefined;
    @Prop() items: File[];
    @Prop() isEditComponent: boolean;

    render() {
        if (!this.items && !this.items.length) {
            return null;
        }

        if (this.isEditComponent) {
            return (
                this.items.map(file => {
                    return (
                        <li class="list-item">
                            <p>{file.name}</p>
                            <a href="#" onClick={() => this.onDelete(file)}>Remove</a>
                            <a href={file.webViewLink} rel='nofollow' target='_blank'>View</a>
                        </li>
                    )
                })
            )
        }

        return (
            this.items.map(file => {
                return (
                    <li class="list-item">
                        <p>{file.name}</p>
                        <a href={file.webViewLink} rel='nofollow' target='_blank'>View</a>
                    </li>
                )
            })
        )
    }
}
