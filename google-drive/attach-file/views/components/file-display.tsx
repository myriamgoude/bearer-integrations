import {Component, Prop} from '@bearer/core'
import {File} from '../types'
import 'ionicons'
import ViewIcon from './view-icon';

@Component({
    tag: 'file-display',
    styleUrl: 'file-display.css',
    shadow: true
})
export class FileDisplay {
    @Prop() onDelete: (file: File) => void | undefined;
    @Prop() items: File[];

    redirect = (file: File) => {
        window.open(file.webViewLink, '_blank');
    };

    render() {
        if (!this.items && !this.items.length) {
            return null;
        }

            return (
                this.items.map(file => {
                    return (
                        <li class="list-item">
                            <div>
                                <p><strong>{file.name}</strong> {file.size ?
                                    <span class="file-size">{(Number(file.size) / 1000000).toFixed(2)} Mo</span> : null}
                                </p>
                                { this.onDelete && <a class="remove-link" href="#" onClick={() => this.onDelete(file)}>Remove</a> }
                            </div>
                            <div onClick={() => {this.redirect(file)}} class="preview">
                                <ViewIcon />
                            </div>
                        </li>
                    )
                })
            )
    }
}
