import { __decorate } from "tslib";
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter, merge, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
let IntegrationUpworkLayoutComponent = class IntegrationUpworkLayoutComponent {
    constructor() {
        this._translateService = inject(TranslateService);
        this._store = inject(Store);
        this._i18nService = inject(I18nService);
    }
    ngOnInit() {
        this.initializeUiLanguagesAndLocale(); // Initialize UI languages and Update Locale
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationUpworkLayoutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: IntegrationUpworkLayoutComponent, isStandalone: false, selector: "ngx-integration-upwork-layout", ngImport: i0, template: `<router-outlet></router-outlet>`, isInline: true, dependencies: [{ kind: "directive", type: i1.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
IntegrationUpworkLayoutComponent = __decorate([
    UntilDestroy({ checkProperties: true })
], IntegrationUpworkLayoutComponent);
export { IntegrationUpworkLayoutComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationUpworkLayoutComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-integration-upwork-layout',
                    template: `<router-outlet></router-outlet>`,
                    standalone: false,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }] });
//# sourceMappingURL=integration-upwork.layout.component.js.map