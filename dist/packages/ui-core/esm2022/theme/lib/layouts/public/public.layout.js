import { __decorate, __metadata } from "tslib";
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { NbLayoutComponent, NbThemeService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, UsersService } from '@gauzy/ui-core/core';
import { WindowModeBlockScrollService } from '../../services';
import * as i0 from "@angular/core";
import * as i1 from "../../services";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
let PublicLayoutComponent = class PublicLayoutComponent {
    constructor(platformId, windowModeBlockScrollService, store, usersService, themeService) {
        this.platformId = platformId;
        this.windowModeBlockScrollService = windowModeBlockScrollService;
        this.store = store;
        this.usersService = usersService;
        this.themeService = themeService;
    }
    ngOnInit() {
        this.loadCurrentUserAndPermissions();
        this.themeService
            .getJsTheme()
            .pipe(distinctUntilChange(), tap((theme) => this.themeService.changeTheme((this.store.currentTheme ? this.store.currentTheme : theme.name))), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.windowModeBlockScrollService.register(this.layout);
        }
    }
    /**
     * Loads the current user's data and updates the store with user details and permissions.
     */
    async loadCurrentUserAndPermissions() {
        const id = this.store.userId;
        // Return early if the user ID is not set
        if (!id) {
            console.warn('No user ID found in the store.');
            return;
        }
        try {
            // Fetch user details, including role permissions and tenant information
            this.user = await this.usersService.getMe(['role', 'role.rolePermissions', 'tenant'], true);
            // Update the store with user details and role permissions
            this.store.userRolePermissions = this.user.role.rolePermissions;
            this.store.user = this.user;
        }
        catch (error) {
            console.error('Error loading current user data:', error);
            // Handle the error as appropriate (e.g., user feedback, retry logic, etc.)
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutComponent, deps: [{ token: PLATFORM_ID }, { token: i1.WindowModeBlockScrollService }, { token: i2.Store }, { token: i2.UsersService }, { token: i3.NbThemeService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PublicLayoutComponent, isStandalone: false, selector: "ngx-public-layout", viewQueries: [{ propertyName: "layout", first: true, predicate: NbLayoutComponent, descendants: true }], ngImport: i0, template: "<nb-layout windowMode>\n\t<nb-layout-column>\n\t\t<ng-content select=\"router-outlet\"></ng-content>\n\t</nb-layout-column>\n</nb-layout>\n", styles: ["/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i3.NbLayoutComponent, selector: "nb-layout", inputs: ["center", "windowMode", "withScroll", "restoreScrollTop"] }, { kind: "component", type: i3.NbLayoutColumnComponent, selector: "nb-layout-column", inputs: ["left", "start"] }] }); }
};
PublicLayoutComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Object, WindowModeBlockScrollService,
        Store,
        UsersService,
        NbThemeService])
], PublicLayoutComponent);
export { PublicLayoutComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-public-layout', standalone: false, template: "<nb-layout windowMode>\n\t<nb-layout-column>\n\t\t<ng-content select=\"router-outlet\"></ng-content>\n\t</nb-layout-column>\n</nb-layout>\n", styles: ["/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.WindowModeBlockScrollService }, { type: i2.Store }, { type: i2.UsersService }, { type: i3.NbThemeService }], propDecorators: { layout: [{
                type: ViewChild,
                args: [NbLayoutComponent]
            }] } });
//# sourceMappingURL=public.layout.js.map