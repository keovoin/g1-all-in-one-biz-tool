import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { filter, merge, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "ngx-permissions";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@gauzy/ui-core/i18n";
import * as i5 from "@angular/router";
let ProposalLayoutComponent = class ProposalLayoutComponent {
    constructor(_translateService, _ngxPermissionsService, _store, _i18nService) {
        this._translateService = _translateService;
        this._ngxPermissionsService = _ngxPermissionsService;
        this._store = _store;
        this._i18nService = _i18nService;
        this.initializeUiPermissions(); // Initialize UI permissions
        this.initializeUiLanguagesAndLocale(); // Initialize UI languages and Update Locale
    }
    /**
     * Initialize UI permissions
     */
    initializeUiPermissions() {
        // Load permissions
        const permissions = this._store.userRolePermissions.map(({ permission }) => permission);
        this._ngxPermissionsService.flushPermissions(); // Flush permissions
        this._ngxPermissionsService.loadPermissions(permissions); // Load permissions
    }
    /**
     * Initialize UI languages and Update Locale
     */
    initializeUiLanguagesAndLocale() {
        // Observable that emits when preferred language changes.
        const preferredLanguage$ = merge(this._store.preferredLanguage$, this._i18nService.preferredLanguage$).pipe(distinctUntilChange(), filter((lang) => !!lang), tap((lang) => {
            this._translateService.use(lang);
        }), untilDestroyed(this));
        // Subscribe to initiate the stream
        preferredLanguage$.subscribe();
    }
    /**
     * Unsubscribe from all subscriptions
     */
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalLayoutComponent, deps: [{ token: i1.TranslateService }, { token: i2.NgxPermissionsService }, { token: i3.Store }, { token: i4.I18nService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProposalLayoutComponent, isStandalone: false, selector: "gz-proposal-layout", ngImport: i0, template: ` <router-outlet></router-outlet>`, isInline: true, styles: [":host{height:100%;display:block}\n"], dependencies: [{ kind: "directive", type: i5.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }] }); }
};
ProposalLayoutComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [TranslateService,
        NgxPermissionsService,
        Store,
        I18nService])
], ProposalLayoutComponent);
export { ProposalLayoutComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-proposal-layout', template: ` <router-outlet></router-outlet>`, standalone: false, styles: [":host{height:100%;display:block}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NgxPermissionsService }, { type: i3.Store }, { type: i4.I18nService }] });
//# sourceMappingURL=proposal-layout.component.js.map