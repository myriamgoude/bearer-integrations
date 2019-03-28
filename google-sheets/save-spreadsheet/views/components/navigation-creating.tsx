import {Component, Prop} from "@bearer/core";

@Component({ tag: 'navigation-creating', styleUrl: 'navigation-creating.css' })
export class NavigationCreating {
    @Prop() folder: string;

    render() {
        return (
            <div class="create-container">
                <span class="text-span">Exporting data to</span>
                <span class="text-span"><strong>{this.folder}</strong></span>
                <div class="loader-background">
                <div class="loader"></div>
                </div>
            </div>
        )
    }
}
