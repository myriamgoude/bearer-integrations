import {Component, Prop} from '@bearer/core'
import {File} from '../types'
import 'ionicons'

const iconStyle ={
    alignSelf: 'center',
    fontSize: '1.2em',
}

@Component({
    tag: 'file-display',
    styleUrl: 'file-display.css',
    shadow: true
})
export class FileDisplay {
    @Prop() onDelete: (file: File) => void | undefined;
    @Prop() items: File[];
    @Prop() isEditComponent: boolean;

    redirect = (file: File) => {
        window.open(file.webViewLink, '_blank');
    };

    render() {
        if (!this.items && !this.items.length) {
            return null;
        }

        if (this.isEditComponent) {
            return (
                this.items.map(file => {
                    return (
                        <li class="list-item">
                            <div>
                                <p>{file.path.join('/')}</p>
                                <a href="#" onClick={() => this.onDelete(file)}>REMOVE</a>
                            </div>
                            <div onClick={() => {this.redirect(file)}} class="preview">
                                <ion-icon name="open" style={iconStyle}></ion-icon>
                            </div>
                        </li>
                    )
                })
            )
        }

        return (
            this.items.map(file => {
                return (
                    <li class="list-item">
                        <div>
                            <p>{file.name}</p>
                        </div>
                        <div onClick={() => {this.redirect(file)}} class="preview">
                            <ion-icon name="open" style={iconStyle}></ion-icon>
                        </div>
                    </li>
                )
            })
        )
    }
}
