import { HttpClient } from '@angular/common/http';
import { IUser } from '@gauzy/contracts';
import { Router } from '@angular/router';
import { Store } from '../store/store.service';
import { PermissionsService } from '../permission/permissions.service';
import { UsersService } from '../users';
import { AuthStrategy } from '../auth/auth-strategy.service';
import * as i0 from "@angular/core";
export declare class AppInitService {
    private readonly _router;
    private readonly _store;
    private readonly _usersService;
    private readonly _authStrategy;
    private readonly _permissionsService;
    private readonly _http;
    user: IUser;
    constructor(_router: Router, _store: Store, _usersService: UsersService, _authStrategy: AuthStrategy, _permissionsService: PermissionsService, _http: HttpClient);
    init(): Promise<void>;
    /**
     * Ask the API whether billing exists here, and remember the answer.
     *
     * Deliberately swallows every failure and leaves the flag false. An older API has no such route,
     * and a deployment that cannot answer is one that should not be showing billing UI anyway — so the
     * safe default and the failure default are the same value.
     */
    private loadBillingAvailability;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppInitService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppInitService>;
}
