import {Component, Prop} from '@bearer/core'
import {File} from '../types'

@Component({
    tag: 'folder-display',
    shadow: true
})
export class FolderDisplay {
    @Prop() onDelete: (folder: File) => void | undefined;
    @Prop() items: File[];
    @Prop() isEditComponent: boolean;

    render() {
        if (!this.items && !this.items.length) {
            return null;
        }

        if (this.isEditComponent) {
            return (
                this.items.map(folder => {
                    return (
                        <li class="list-item">
                            <p>{folder.name}</p>
                            <a href="#" onClick={() => this.onDelete(folder)}>Remove</a>
                            <a href={folder.webViewLink} rel='nofollow' target='_blank'>View</a>
                        </li>
                    )
                })
            )
        }

        return (
            this.items.map(folder => {
                return (
                    <li class="list-item">
                        <p>{folder.name}</p>
                        <a href={folder.webViewLink} rel='nofollow' target='_blank'>View</a>
                    </li>
                )
            })
        )
    }

}
