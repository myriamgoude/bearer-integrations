import {Component, Prop} from "@bearer/core";

@Component({ tag: 'navigation-creating', styleUrl: 'navigation-creating.css' })
export class NavigationCreating {
    @Prop() folder: string;

    render() {
        return (
            <div class="create-container">
                <span>Exporting data to</span>
                <span><strong>{this.folder}</strong></span>
                <div class="loader"></div>
            </div>
        )
    }
}
