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
    [InterfaceState.Folder]: 'Select destination',
    [InterfaceState.Files]:'Select one file',
    [InterfaceState.Error]:'Select destination',
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

    @State() foldersData: File[] | undefined;
    @State() selectedFolder: File | undefined;
    @State() selectedFolders: File[] | undefined = [];
    @State() foldersSearchResults: File[] | undefined;

    @Output() folders: File[];

    @Element() el: HTMLElement;

    @Listen('body:edit-removed')
    fileRemovedHandler (e:CustomEvent) {
        const folder = e.detail as File;
        const updatedList = this.folders.filter((elm: File) => folder.id !== elm.id);
        this.folders = [...updatedList];
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
                this.folders = data;
            }).catch(this.handleError)
    };

    handleSearchQuery = (query: string) => {
        const matcher = query.toLocaleLowerCase();
        this.foldersSearchResults = [...this.folders.filter(c => fuzzysearch(matcher, c.name.toLocaleLowerCase()))];
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
                this.folders = data
            }).catch(this.handleError)
    };

    handleError = error => {
        this.ui = InterfaceState.Error;
        this.errorMessage = error.error;
    };

    handleItemSelect = (selectedItem: File) => {
        this.selectedFolder = selectedItem;
        this.selectedFolders.push(selectedItem);
        this.handleFolderSelect(selectedItem);
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

    handleAttachFolder = () => {
        this.folders = [this.selectedFolder];
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
            text="Save to Google Drive"
        />
    );

    renderAuthorized: any = ({ revoke }) => {
        this.revoke = revoke;
        return (
            <icon-button onClick={this.handleAttachClick} text="Save to Google Drive" />
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
                if (this.foldersSearchResults) {
                    return (
                        <list-navigation
                            options={this.foldersSearchResults}
                            selectedFolder={this.selectedFolder}
                            attributeName={'name'}
                            onSearchQuery={this.handleSearchQuery}
                            showNextIcon={true}
                            onOptionClicked={this.handleItemSelect}
                            onSaveClicked={this.handleAttachFolder}/>
                    );
                }
                return (
                    <list-navigation
                        options={this.foldersData}
                        selectedFolder={this.selectedFolder}
                        attributeName={'name'}
                        onSearchQuery={this.handleSearchQuery}
                        showNextIcon={true}
                        onOptionClicked={this.handleItemSelect}
                        onSaveClicked={this.handleAttachFolder}/>
                );
        }
        return null
    };

    handleExternalClick = (_e:Event) => {
        this.selectedFolder = undefined;
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
