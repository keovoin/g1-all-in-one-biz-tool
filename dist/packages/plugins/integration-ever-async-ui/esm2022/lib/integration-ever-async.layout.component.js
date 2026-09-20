import { __decorate } from "tslib";
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter, merge, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LanguagesEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
let IntegrationEverAsyncLayoutComponent = class IntegrationEverAsyncLayoutComponent {
    constructor() {
        this._translateService = inject(TranslateService);
        this._store = inject(Store);
        this._i18nService = inject(I18nService);
    }
    ngOnInit() {
        this.initializeUiLanguagesAndLocale();
    }
    /**
     * Initialize UI languages and Update Locale
     */
    initializeUiLanguagesAndLocale() {
        const preferredLanguage$ = merge(this._store.preferredLanguage$, this._i18nService.preferredLanguage$).pipe(distinctUntilChange(), filter((lang) => !!lang && Object.values(LanguagesEnum).includes(lang)), tap((lang) => {
            this._translateService.use(lang);
        }), untilDestroyed(this));
        preferredLanguage$.subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEverAsyncLayoutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: IntegrationEverAsyncLayoutComponent, isStandalone: false, selector: "ngx-integration-ever-async-layout", ngImport: i0, template: `<router-outlet></router-outlet>`, isInline: true, dependencies: [{ kind: "directive", type: i1.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
IntegrationEverAsyncLayoutComponent = __decorate([
    UntilDestroy({ checkProperties: true })
], IntegrationEverAsyncLayoutComponent);
export { IntegrationEverAsyncLayoutComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEverAsyncLayoutComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-integration-ever-async-layout',
                    template: `<router-outlet></router-outlet>`,
                    standalone: false,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }] });
//# sourceMappingURL=integration-ever-async.layout.component.js.map