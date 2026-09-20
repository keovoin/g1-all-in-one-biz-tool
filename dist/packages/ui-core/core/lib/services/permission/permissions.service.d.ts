import { HttpClient } from '@angular/common/http';
import { NgxPermissionsService } from 'ngx-permissions';
import { IRolePermissions } from '@gauzy/contracts';
import { Store } from '../store/store.service';
import { ErrorHandlingService } from '../notification/error-handling.service';
import * as i0 from "@angular/core";
export declare class PermissionsService {
    private readonly _http;
    private readonly _ngxPermissionsService;
    private readonly _store;
    private readonly _errorHandlingService;
    constructor(_http: HttpClient, _ngxPermissionsService: NgxPermissionsService, _store: Store, _errorHandlingService: ErrorHandlingService);
    /**
     * Loads the permissions asynchronously and updates the user's role permissions in the store.
     *
     * @return {Promise<void>} A promise that resolves when the permissions are loaded.
     */
    loadPermissions(): Promise<void>;
    /**
     * Retrieves the permissions for the current user.
     *
     * @return {Promise<IRolePermissions>} A promise that resolves to the pagination of the role permissions.
     */
    getPermissions(): Promise<IRolePermissions>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PermissionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PermissionsService>;
}
