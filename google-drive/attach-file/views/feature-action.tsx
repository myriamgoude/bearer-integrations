/*
  The purpose of this component is to deal with scenario navigation between each views.

*/

import {BearerFetch, Element, Intent, Listen, Output, Prop, RootComponent, State} from '@bearer/core';
import '@bearer/ui';
import { File } from "./types";

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
    @Intent('searchData') searchData: BearerFetch;
    @Intent('fetchPreviousFolder') fetchPreviousFolder: BearerFetch;

    @State() ui: InterfaceState = InterfaceState.Unauthenticated;
    @State() errorMessage: string | undefined;
    @State() revoke: any | undefined;
    @State() authorize: any | undefined;

    @State() data: File[] | undefined;
    @State() path: string[] | undefined = [];
    @State() selectedFolder: File | undefined;
    @State() filesSearchResults: File[] | undefined;

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
        this.getData()
            .then(({data}:{data: File[]}) => {
                this.data = data;
            }).catch(this.handleError);
    };

    handleSearchQuery = (query: string) => {
        this.data = undefined;
        this.filesSearchResults = undefined;
        const req = (query.length > 3) ? this.searchData({query}) : this.getData();
        req.then(({data}: {data: File[]}) => {
            this.filesSearchResults = data;
        }).catch(this.handleError);
    };

    handleFolderSelect = (selectedFolder: File, mainFolder?: boolean) => {
        this.data = undefined;
        let params = {} as {folderId: string};
        if (mainFolder) {
            params.folderId = undefined;
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
        this.filesSearchResults = undefined;
        if (selectedItem.mimeType === 'application/vnd.google-apps.folder') {
            this.selectedFolder = selectedItem;
            this.path.push(selectedItem.name);
            this.handleFolderSelect(selectedItem);
        } else {
            this.handleAttachFile(selectedItem);
        }
    };

    handleWorkflowBack = () => {
        this.path.splice(-1,1);
        switch(this.ui) {
            case InterfaceState.Settings:
            case InterfaceState.Folder:
                this.fetchPreviousFolderData();
                break;
            case InterfaceState.Error:
                this.ui = InterfaceState.Authenticated;
                break;
        }
    };

    fetchPreviousFolderData = () => {
        if (!this.selectedFolder || !this.selectedFolder.parents) {
            this.data = undefined;
            this.ui = InterfaceState.Authenticated;
            return;
        }
        this.data = undefined;
        this.getData({folderId: this.selectedFolder.parents[0]}).then(({data}:{data: File[]}) => {
            this.data = data;
        }).catch(this.handleError);
        this.fetchPreviousFolder({folderId: this.selectedFolder.parents[0]}).then(({data}:{data: File}) => {
            this.selectedFolder = data;
        }).catch(this.handleError)
    };

    handleAttachFile = (file: any) => {
        file.path = this.path;
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
        this.data = undefined;
        this.path = [];
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
        this.authorize = authenticate;
        authenticate()
            .then(() => {
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
            <div style={{display: 'flex', width: '375px', justifyContent: 'space-between'}}>
                <icon-button onClick={() => this.onAuthorizeClick(this.authorize)} text="Connect to Google Drive"/>
                <icon-button onClick={this.handleAttachClick} text="Attach a file" />
            </div>
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
                                onBackClicked={this.handleWorkflowBack}
                                showNextIcon={true}
                                onOptionClicked={this.handleItemSelect}/>
                        </div>
                    );
                }
                    return (
                        <div>
                            <list-navigation
                                options={this.data}
                                attributeName={'name'}
                                onSearchQuery={this.handleSearchQuery}
                                showNextIcon={true}
                                onBackClicked={this.handleWorkflowBack}
                                onOptionClicked={this.handleItemSelect}/>
                        </div>
                    );
        }
        return null
    };

    handleExternalClick = (_e:Event) => {
        this.data = undefined;
        this.selectedFolder = undefined;
        this.filesSearchResults = undefined;
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
