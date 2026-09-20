import { AfterViewInit, OnInit } from '@angular/core';
import { NbLayoutComponent, NbThemeService } from '@nebular/theme';
import { Store, UsersService } from '@gauzy/ui-core/core';
import { WindowModeBlockScrollService } from '../../services';
import * as i0 from "@angular/core";
export declare class PublicLayoutComponent implements OnInit, AfterViewInit {
    private platformId;
    private readonly windowModeBlockScrollService;
    private readonly store;
    private readonly usersService;
    private readonly themeService;
    constructor(platformId: any, windowModeBlockScrollService: WindowModeBlockScrollService, store: Store, usersService: UsersService, themeService: NbThemeService);
    layout: NbLayoutComponent;
    user: any;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Loads the current user's data and updates the store with user details and permissions.
     */
    private loadCurrentUserAndPermissions;
    static ɵfac: i0.ɵɵFactoryDeclaration<PublicLayoutComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PublicLayoutComponent, "ngx-public-layout", never, {}, {}, never, ["router-outlet"], false, never>;
}
