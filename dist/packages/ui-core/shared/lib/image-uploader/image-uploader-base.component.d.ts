import { FileUploader } from 'ng2-file-upload';
import { Subject } from 'rxjs';
import { IOrganization, IUser } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ImageUploaderBaseComponent {
    protected readonly store: Store;
    organization: IOrganization;
    user: IUser;
    uploader: FileUploader;
    protected subject$: Subject<boolean>;
    _folder: string;
    get folder(): string;
    set folder(value: string);
    constructor(store: Store);
    onInit(): void;
    /**
     * Set file uploader configuration options
     */
    setUploaderConfigurationOptions(): void;
    /**
     * Get image metadata using by Image URL
     *
     * @param url
     * @returns
     */
    protected getImageMetadata(url: string): Promise<unknown>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageUploaderBaseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ImageUploaderBaseComponent, "ng-component", never, { "folder": { "alias": "folder"; "required": false; }; }, {}, never, never, false, never>;
}
