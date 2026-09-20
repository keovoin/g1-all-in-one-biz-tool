import { OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { IOrganization, IUser } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ImageUploaderComponent implements AfterViewInit, OnInit {
    private readonly store;
    organization: IOrganization;
    user: IUser;
    uploader: FileUploader;
    private _styles;
    get styles(): Object;
    set styles(styles: Object);
    private _folder;
    get folder(): string;
    set folder(value: string);
    changeHoverState: EventEmitter<boolean>;
    uploadedImageAsset: EventEmitter<any>;
    uploadImageAssetError: EventEmitter<any>;
    constructor(store: Store);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Image asset upload handler
     */
    imageUploadHandler(): void;
    /**
     * Load settings for the file uploader, including headers and additional form data.
     *
     * @returns void
     */
    private _loadUploaderSettings;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageUploaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ImageUploaderComponent, "ngx-image-uploader", never, { "styles": { "alias": "styles"; "required": false; }; "folder": { "alias": "folder"; "required": false; }; }, { "changeHoverState": "changeHoverState"; "uploadedImageAsset": "uploadedImageAsset"; "uploadImageAssetError": "uploadImageAssetError"; }, never, never, false, never>;
}
