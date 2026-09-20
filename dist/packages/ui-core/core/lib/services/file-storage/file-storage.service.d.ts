import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IWasabiFileStorageProviderConfig } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class FileStorageService {
    private readonly http;
    constructor(http: HttpClient);
    validateWasabiCredentials(config: IWasabiFileStorageProviderConfig): Promise<any> | HttpErrorResponse;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileStorageService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FileStorageService>;
}
