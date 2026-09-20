import { EventEmitter, OnInit } from '@angular/core';
import { FileStorageProviderEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class FileProviderSelectorComponent implements OnInit {
    fileStorageProviders: {
        label: FileStorageProviderEnum;
        value: any;
    }[];
    /**
     * Getter & Setter for dynamic provider
     */
    private _provider;
    set provider(val: FileStorageProviderEnum);
    get provider(): FileStorageProviderEnum;
    onChange: any;
    onTouched: any;
    onSelectionChanged: EventEmitter<any>;
    ngOnInit(): void;
    /**
     *
     * @param value
     */
    writeValue(value: FileStorageProviderEnum): void;
    /**
     *
     * @param fn
     */
    registerOnChange(fn: (rating: number) => void): void;
    /**
     *
     * @param fn
     */
    registerOnTouched(fn: () => void): void;
    /**
     * On changed file storage provider
     *
     * @param provider
     */
    onSelectionChange(provider: FileStorageProviderEnum): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileProviderSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileProviderSelectorComponent, "file-provider-selector", never, { "provider": { "alias": "provider"; "required": false; }; }, { "onSelectionChanged": "onSelectionChanged"; }, never, never, false, never>;
}
