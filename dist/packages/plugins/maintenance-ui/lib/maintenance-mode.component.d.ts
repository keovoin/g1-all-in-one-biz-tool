import { OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ServerConnectionService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class MaintenanceModeComponent implements OnInit, OnDestroy {
    private readonly _store;
    private readonly _location;
    private readonly _serverConnectionService;
    noInternetLogo: string;
    interval: any;
    constructor(_store: Store, _location: Location, _serverConnectionService: ServerConnectionService);
    ngOnInit(): void;
    /**
     * Checks the server connection every 5 seconds.
     */
    private checkConnection;
    /**
     * Checks if the company site is defined in the environment.
     *
     * @return {string} The company site name.
     */
    get companySite(): string;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaintenanceModeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MaintenanceModeComponent, "ga-maintenance-mode", never, {}, {}, never, never, false, never>;
}
