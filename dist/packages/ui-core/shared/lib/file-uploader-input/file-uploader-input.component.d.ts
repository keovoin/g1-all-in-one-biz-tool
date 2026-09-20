import { EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IImageAsset } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { ImageUploaderBaseComponent } from '../image-uploader/image-uploader-base.component';
import * as i0 from "@angular/core";
export declare class FileUploaderInputComponent extends ImageUploaderBaseComponent implements AfterViewInit, OnInit {
    protected readonly store: Store;
    inputControl: FormControl<any>;
    loading: boolean;
    _placeholder: string;
    get placeholder(): string;
    set placeholder(value: string);
    _locale: string;
    get locale(): string;
    set locale(value: string);
    _fileUrl: string;
    get fileUrl(): string;
    set fileUrl(fileUrl: string);
    uploadedImageAsset: EventEmitter<IImageAsset>;
    uploadedImgUrl: EventEmitter<string>;
    uploadedImgData: EventEmitter<any>;
    constructor(store: Store);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * When input changed file URL
     *
     * @param event
     */
    inputUrlChanged(): Promise<void>;
    /**
     * Image asset upload handler
     */
    imageUploadHandler(): void;
    /**
     * Get image metadata and setup image object
     *
     * @param imgUrl
     * @returns
     */
    private _setupImage;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileUploaderInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileUploaderInputComponent, "ngx-file-uploader-input", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "locale": { "alias": "locale"; "required": false; }; "fileUrl": { "alias": "fileUrl"; "required": false; }; }, { "uploadedImageAsset": "uploadedImageAsset"; "uploadedImgUrl": "uploadedImgUrl"; "uploadedImgData": "uploadedImgData"; }, never, never, false, never>;
}
