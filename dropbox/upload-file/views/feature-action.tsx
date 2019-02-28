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
    Settings,
    Error,
}

const StateTitles = {
    [InterfaceState.Folder]: 'Select destination',
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
    @Prop() authId: string;
    @Prop() fileURL: string;
    @Intent('listData') getData: BearerFetch;
    @Intent('searchData') searchData: BearerFetch;
    @Intent('fetchMainFolder') fetchMainFolder: BearerFetch;
    @Intent('uploadFile') uploadFile: BearerFetch;

    @State() ui: InterfaceState = InterfaceState.Unauthenticated;
    @State() errorMessage: string | undefined;
    @State() revoke: any | undefined;

    @State() foldersData: File[] | undefined;
    @State() selectedFolder: File | undefined;
    @State() foldersSearchResults: File[] | undefined;
    @State() authorized = false;
    @State() rootFolder = false;
    @State() showButton = true;

    @Output() folders: File[];

    @Element() el: HTMLElement;

    @Listen('body:edit-removed')
    fileRemovedHandler (e:CustomEvent) {
        const folder = e.detail as File;
        if (folder.id === 'root') {
            this.folders[0] = folder;
        }
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
        this.getData({ authId: this.authId })
            .then(({data}:{data: File[]}) => {
                this.foldersData = data;
            }).catch(this.handleError)
    };

    handleSearchQuery = (query: string) => {
        this.foldersData = undefined;
        this.foldersSearchResults = undefined;
        const req = (query.length > 3) ? this.searchData({authId: this.authId, query}) : this.getData({ authId: this.authId });
        req.then(({data}: {data: File[]}) => {
            this.foldersSearchResults = data;
        }).catch(this.handleError);
    };

    handleFolderSelect = (selectedFolder: File) => {
        this.rootFolder = true;
        this.foldersData = undefined;
        let params = {} as {folderPath: string};
        params.folderPath = `${selectedFolder.path_lower}`;
        this.getData(params)
            .then(({data}:{data: File[]}) => {
                this.foldersData = data;
            }).catch(this.handleError)
    };

    handleError = error => {
        this.ui = InterfaceState.Error;
        this.errorMessage = error.error;
    };

    handleItemSelect = (selectedItem: File) => {
        this.foldersSearchResults = undefined;
        this.selectedFolder = selectedItem;
        this.handleFolderSelect(selectedItem);
    };

    handleWorkflowBack = () => {
        switch(this.ui) {
            case InterfaceState.Settings:
            case InterfaceState.Folder:
                this.getMainFolder();
                break;
            case InterfaceState.Error:
                this.ui = InterfaceState.Authenticated;
                break;
        }
    };

    handleAttachFolder = () => {
        let root;
        if (!this.selectedFolder) {
            root = {name: 'Dropbox', path_display: '', path_lower: '', id: 'root'};
            this.folders = [root]
        }
        this.folders = [this.selectedFolder];
        if(this.autoClose) {
            this.ui = InterfaceState.Authenticated;
        }

        //TODO need to handle uploading files to google drive using axios

        if (this.fileURL) {
            this.uploadFile({fileUrl: this.fileURL, folderId: this.selectedFolder ? this.selectedFolder.id : root.path_display}).then(() => {
                console.log('success');
            }).catch(this.handleError);
        }
    };

    getMainFolder = () => {
        if (!this.selectedFolder) {
            this.foldersData = undefined;
            this.ui = InterfaceState.Authenticated;
            return;
        }
        this.foldersData = undefined;
        this.getData({authId: this.authId, folderPath: this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '')}).then(({data}:{data: File[]}) => {
            this.foldersData = data;
        }).catch(this.handleError);
        if (this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '') !== '') {
            this.fetchMainFolder({authId: this.authId, folderPath: this.selectedFolder.path_display.replace(`/${this.selectedFolder.name}`, '')}).then(({data}:{data: File}) => {
                this.selectedFolder = data;
            }).catch(this.handleError)
        } else {
            this.selectedFolder = undefined;
            this.rootFolder = false;
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
            .then(() => {
                this.authorized = true;
                this.ui = InterfaceState.Authenticated;
                this.handleAttachClick()
            })
            .catch(console.error)
    };

    renderUnauthorized: any = ({ authenticate }) => (
        <icon-button
            onClick={() => this.onAuthorizeClick(authenticate)}
            text="Save to Dropbox"
        />
    );

    renderAuthorized: any = ({ revoke }) => {
        this.revoke = revoke;
        return (
            <icon-button onClick={this.handleAttachClick} text="Save to Dropbox" />
        )
    };

    renderWorkflow = () => {
        if(this.ui > InterfaceState.Authenticated){
            return (
                <workflow-box
                    heading={StateTitles[this.ui] || ""}
                    subHeading={(this.selectedFolder) ? `From ${this.selectedFolder.name}` : undefined}
                    onBack={this.handleWorkflowBack}
                    showSaveButton={this.showButton}
                    selectedFolder={this.selectedFolder}
                    rootFolder={this.rootFolder}
                    onClose={this.handleExternalClick}
                    onSaveClicked={this.handleAttachFolder}
                    onMenu={(this.ui == InterfaceState.Settings) ? undefined : this.handleMenu }
                    style={{position: 'absolute', marginLeft: '24px'}}
                >
                    {this.renderWorkflowContent()}
                </workflow-box>
            )
        }
    };

    renderWorkflowContent = () => {
        switch(this.ui){
            case InterfaceState.Error:
                this.rootFolder = false;
                this.showButton = false;
                return <error-message
                    message={this.errorMessage}
                    onRetry={this.handleRetry}
                />;
            case InterfaceState.Settings:
                this.rootFolder = false;
                this.showButton = false;
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
                if (this.foldersSearchResults && this.foldersSearchResults.length !== 0) {
                    return (
                        <div>
                            <list-navigation
                                options={this.foldersSearchResults}
                                attributeName={'name'}
                                onSearchQuery={this.handleSearchQuery}
                                showNextIcon={true}
                                onOptionClicked={this.handleItemSelect}/>
                        </div>
                    );
                }
                return (
                    <div>
                        <list-navigation
                            options={this.foldersData}
                            attributeName={'name'}
                            onSearchQuery={this.handleSearchQuery}
                            showNextIcon={true}
                            onOptionClicked={this.handleItemSelect}/>
                    </div>
                );
        }
        return null
    };

    handleExternalClick = (_e:Event) => {
        this.foldersData = undefined;
        this.selectedFolder = undefined;
        this.foldersSearchResults = undefined;
        this.rootFolder = false;
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
            <span>
                <bearer-authorized
                    renderUnauthorized={this.renderUnauthorized}
                    renderAuthorized={this.renderAuthorized}
                />
                {this.renderWorkflow()}
            </span>
        )
    }
}
