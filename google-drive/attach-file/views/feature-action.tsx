/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import {BearerFetch, Element, Intent, Listen, Output, Prop, RootComponent, State} from '@bearer/core';
import '@bearer/ui';
import { File } from "./types";
import fuzzysearch from "./fuzzy";

enum InterfaceState {
    Unauthenticated,
    Authenticated,
    Folder,
    Files,
    Settings,
    Error,
}

const StateTitles = {
    [InterfaceState.Folder]: 'Select files',
    [InterfaceState.Files]:'Select one file',
    [InterfaceState.Error]:'Select files',
    [InterfaceState.Settings]:'Settings',
};

@RootComponent({
  role: 'action',
  group: 'feature'
})
export class FeatureAction {
    @Prop() autoClose: boolean = true;
    @Prop() multi: boolean = true;
    @Intent('listData') getData: BearerFetch;

    @State() ui: InterfaceState = InterfaceState.Unauthenticated;
    @State() errorMessage: string | undefined;
    @State() revoke: any | undefined;

    @State() folders: File[] | undefined;
    @State() data: File[] | undefined;
    @State() selectedFolder: File | undefined;
    @State() selectedFolders: File[] | undefined = [];
    @State() filesSearchResults: File[] | undefined;
    @State() filesWithPath: any | undefined = [];

    @Output() files: File[] = [];

    @Element() el: HTMLElement;

    @Listen('body:edit-removed')
    fileRemovedHandler (e:CustomEvent) {
        const file = e.detail as File;
        const updatedList = this.files.filter((elm: File) => file.id !== elm.id);
        this.files = [...updatedList];
    }

    handleRetry = () => {
        this.ui = InterfaceState.Authenticated;
        this.handleAttachClick()
    };

    handleAttachClick = () => {
        if(this.ui > InterfaceState.Authenticated){
            this.ui = InterfaceState.Authenticated;
            return
        }
        this.selectedFolder = undefined;
        this.errorMessage = undefined;
        this.ui = InterfaceState.Folder;
        this.getData({folderId: 'root'})
            .then(({data}:{data: File[]}) => {
                this.data = data
            }).catch(this.handleError)
    };

    handleSearchQuery = (query: string) => {
        const matcher = query.toLocaleLowerCase();
        this.filesSearchResults = [...this.data.filter(c => fuzzysearch(matcher, c.name.toLocaleLowerCase()))];
    };

    handleFolderSelect = (selectedFolder: File, mainFolder?: boolean) => {
        let params = {} as {folderId: string};
        if (mainFolder) {
            params.folderId = 'root';
        } else {
            params.folderId = `${selectedFolder.id}`
        }
        this.getData(params)
            .then(({data}:{data: File[]}) => {
                this.data = data
            }).catch(this.handleError)
    };

    handleError = error => {
        this.ui = InterfaceState.Error;
        this.errorMessage = error.error;
    };

    handleItemSelect = (selectedItem: File) => {
        if (selectedItem.mimeType === 'application/vnd.google-apps.folder') {
            this.selectedFolder = selectedItem;
            this.selectedFolders.push(selectedItem);
            this.handleFolderSelect(selectedItem);
        } else {
            this.handleAttachFile(selectedItem);
        }
    };

    handleWorkflowBack = () => {
        switch(this.ui) {
            case InterfaceState.Settings:
            case InterfaceState.Folder:
                const index = this.selectedFolders.indexOf(this.selectedFolder) - 1;
                console.log(this.selectedFolders);
                if (index === -1) {
                    this.handleFolderSelect(this.selectedFolders[0], true);
                } else if (index === -2) {
                    this.ui = InterfaceState.Authenticated;
                } else {
                    this.ui = InterfaceState.Folder;
                    this.handleItemSelect(this.selectedFolders[index]);
                }
                break;
            case InterfaceState.Error:
                this.ui = InterfaceState.Authenticated;
                break;
        }
    };

    handleAttachFile = (file: any) => {
        if(this.multi){
            const files = (this.files.length) ? this.files : (this as any).filesInitial || [];
            this.files = [
                ...files.filter((elm: File) => file.id !== elm.id),
                (file as File)
            ]
        } else {
            this.files = [file];
        }
        if(this.autoClose) {
            this.ui = InterfaceState.Authenticated;
        }
    };

    handleMenu = () => {
        this.ui = InterfaceState.Settings
    };

    handleLogout = () => {
        if(this.revoke){ this.revoke() }
        this.revoke = undefined;
        this.ui = InterfaceState.Unauthenticated
    };

    onAuthorizeClick = (authenticate: () => Promise<boolean>) => {
        authenticate()
            .then(()=>{
                this.ui = InterfaceState.Authenticated;
                this.handleAttachClick()
            })
            .catch(console.error)
    };

    renderUnauthorized: any = ({ authenticate }) => (
        <icon-button
            onClick={() => this.onAuthorizeClick(authenticate)}
            text="Connect to Google Drive"
        />
    );

    renderAuthorized: any = ({ revoke }) => {
        this.revoke = revoke;
        return (
            <icon-button onClick={this.handleAttachClick} text="Attach File" />
        )
    };

    renderWorkflow = () => {
        if(this.ui > InterfaceState.Authenticated){
            return (
                <workflow-box
                    heading={StateTitles[this.ui] || ""}
                    subHeading={(this.selectedFolder) ? `From ${this.selectedFolder.name}` : undefined}
                    onBack={this.handleWorkflowBack}
                    onClose={this.handleExternalClick}
                    onMenu={(this.ui == InterfaceState.Settings) ? undefined : this.handleMenu }
                    style={{position: 'absolute', paddingLeft: '10px'}}
                >
                    {this.renderWorkflowContent()}
                </workflow-box>
            )
        }
    };

    renderWorkflowContent = () => {
        switch(this.ui){
            case InterfaceState.Error:
                return <error-message
                    message={this.errorMessage}
                    onRetry={this.handleRetry}
                />;
            case InterfaceState.Settings:
                // just use the same handler for all options as we just have logout
                return (
                    <list-navigation
                        options={[
                            {name: 'Logout', icon: 'ios-log-out'}
                        ]}
                        attributeName={'name'}
                        showNextIcon={false}
                        onOptionClicked={this.handleLogout} />
                );
            case InterfaceState.Folder:
                if (this.filesSearchResults && this.filesSearchResults.length !== 0) {
                    return (
                        <div>
                            <list-navigation
                                options={this.filesSearchResults}
                                attributeName={'name'}
                                onSearchQuery={this.handleSearchQuery}
                                showNextIcon={true}
                                onOptionClicked={this.handleItemSelect}/>
                            <p class="footer-text">Powered by <strong>Bearer.sh</strong></p>
                        </div>
                    );
                }
                return (
                    <div>
                        <list-navigation
                            options={this.data}
                            onSearchQuery={this.handleSearchQuery}
                            attributeName={'name'}
                            showNextIcon={true}
                            onOptionClicked={this.handleItemSelect} />
                        <p class="footer-text">Powered by <strong>Bearer.sh</strong></p>
                    </div>
                );
        }
        return null
    };

    handleExternalClick = (_e:Event) => {
        this.selectedFolder = undefined;
        this.filesSearchResults = [];
        if(this.ui != InterfaceState.Unauthenticated){
            this.ui = InterfaceState.Authenticated
        }
    };

    handleInternalClick = (e:Event) => {
        e.stopImmediatePropagation()
    };

    componentDidLoad() {
        this.el.addEventListener("click", this.handleInternalClick);
        document.addEventListener("click", this.handleExternalClick);
    }

    handleRemove = (file: File) =>{
        const updatedList = this.files.filter((elm:File)=> file.id !== elm.id);
        console.log('remove', file, updatedList)
    };

    render() {
        return (
            <div>
                <bearer-authorized
                    renderUnauthorized={this.renderUnauthorized}
                    renderAuthorized={this.renderAuthorized}
                />
                {this.renderWorkflow()}
            </div>
        )
    }
}
