import {Component} from "@bearer/core";

@Component({tag: 'navigation-success', styleUrl: 'navigation-success.css'})
export class NavigationSuccess {

    render() {
        return (
            <div class="success-container">
                    <span><strong>Well done !</strong></span>
                <span>Your file has been created</span>
            </div>
        )
    }
}
