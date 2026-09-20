import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../../skeleton/skeleton.component";
/**
 * How long a freshly created empty-state waits before it is allowed to claim
 * "No Data".
 *
 * This is the safety net for the ~50 call sites that do NOT pass `[loading]`:
 * every list page mounts with an empty array and only then fires its request,
 * so without a grace window the very first frame tells the user their data is
 * gone. Bounded by construction — the placeholder can never outlive it unless
 * `[loading]` is explicitly still true.
 */
export const NO_DATA_SETTLE_DELAY_MS = 700;
let NoDataMessageComponent = class NoDataMessageComponent extends TranslationBaseComponent {
    constructor(translateService, cdr) {
        super(translateService);
        this.translateService = translateService;
        this.cdr = cdr;
        this.title = this.getTranslation('SM_TABLE.NO_DATA_MESSAGE');
        /**
         * The owning page's in-flight flag. While true the empty state is replaced by
         * a skeleton, because "we have not finished asking" is not the same statement
         * as "there is nothing here".
         */
        this.loading = false;
        /** Shape of the placeholder drawn while loading. */
        this.variant = 'lines';
        /** How many placeholder rows / cards to draw. */
        this.skeletonRows = 5;
        /**
         * Grace window in ms. Pass 0 at call sites that are a genuine terminal state
         * (a 404-style "not found", a validation message) rather than a list result.
         */
        this.settleDelay = NO_DATA_SETTLE_DELAY_MS;
        this.settling = true;
    }
    /** True while the request may still be in flight. */
    get showSkeleton() {
        return !!this.loading || this.settling;
    }
    ngOnInit() {
        if (this.settleDelay > 0) {
            this.settleTimer = setTimeout(() => {
                this.settling = false;
                this.settleTimer = undefined;
                // The host may sit under an OnPush ancestor, which a bare timer
                // callback would not mark dirty.
                this.cdr.markForCheck();
            }, this.settleDelay);
        }
        else {
            this.settling = false;
        }
    }
    ngOnDestroy() {
        if (this.settleTimer) {
            clearTimeout(this.settleTimer);
            this.settleTimer = undefined;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoDataMessageComponent, deps: [{ token: i1.TranslateService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: NoDataMessageComponent, isStandalone: false, selector: "ngx-no-data-message", inputs: { title: "title", message: "message", loading: "loading", variant: "variant", skeletonRows: "skeletonRows", settleDelay: "settleDelay" }, usesInheritance: true, ngImport: i0, template: "@if (showSkeleton) {\n\t<ngx-skeleton [variant]=\"variant\" [rows]=\"skeletonRows\"></ngx-skeleton>\n}\n<!--\n\tDeliberately toggled with a class rather than wrapped in the `@else` above:\n\t`<ng-content>` inside an embedded view is projected once, so call sites that\n\tpass a `[message]` template (daily timesheet, help center) would lose it the\n\tmoment the branch swapped. Keeping the card in the DOM and hiding it costs\n\tnothing and keeps projection stable.\n-->\n<nb-card class=\"p-0 no-data-found\" [class.is-hidden]=\"showSkeleton\">\n\t<nb-card-body>\n\t\t<div class=\"row align-items-center h-100\">\n\t\t\t<div class=\"col-12\">\n\t\t\t\t<div class=\"text-center d-flex justify-content-center py-3\">\n\t\t\t\t\t<nb-icon icon=\"bar-chart-2-outline\" class=\"no-record-icon\"></nb-icon>\n\t\t\t\t</div>\n\t\t\t\t<h5 class=\"text-center m-0\">\n\t\t\t\t\t{{ title }}\n\t\t\t\t</h5>\n\t\t\t\t<p class=\"text-center\">\n\t\t\t\t\t{{ message }}\n\t\t\t\t\t<ng-content select=\"[message]\"></ng-content>\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: [".no-data-found{overflow-y:hidden;background-color:var(--gauzy-card-1)!important;height:100%!important;margin:0}.no-data-found.is-hidden{display:none!important}h5,div{color:var(--gauzy-text-color-1);font-weight:600;font-size:18px}div{color:var(--text-primary-color)}p{color:var(--gauzy-text-color-2)}.no-record-icon{transform:rotate(.75turn) scaleY(-1);font-size:48px}:host{height:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i3.SkeletonComponent, selector: "ngx-skeleton", inputs: ["variant", "rows", "columns"] }] }); }
};
NoDataMessageComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService, ChangeDetectorRef])
], NoDataMessageComponent);
export { NoDataMessageComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NoDataMessageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-no-data-message', standalone: false, template: "@if (showSkeleton) {\n\t<ngx-skeleton [variant]=\"variant\" [rows]=\"skeletonRows\"></ngx-skeleton>\n}\n<!--\n\tDeliberately toggled with a class rather than wrapped in the `@else` above:\n\t`<ng-content>` inside an embedded view is projected once, so call sites that\n\tpass a `[message]` template (daily timesheet, help center) would lose it the\n\tmoment the branch swapped. Keeping the card in the DOM and hiding it costs\n\tnothing and keeps projection stable.\n-->\n<nb-card class=\"p-0 no-data-found\" [class.is-hidden]=\"showSkeleton\">\n\t<nb-card-body>\n\t\t<div class=\"row align-items-center h-100\">\n\t\t\t<div class=\"col-12\">\n\t\t\t\t<div class=\"text-center d-flex justify-content-center py-3\">\n\t\t\t\t\t<nb-icon icon=\"bar-chart-2-outline\" class=\"no-record-icon\"></nb-icon>\n\t\t\t\t</div>\n\t\t\t\t<h5 class=\"text-center m-0\">\n\t\t\t\t\t{{ title }}\n\t\t\t\t</h5>\n\t\t\t\t<p class=\"text-center\">\n\t\t\t\t\t{{ message }}\n\t\t\t\t\t<ng-content select=\"[message]\"></ng-content>\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: [".no-data-found{overflow-y:hidden;background-color:var(--gauzy-card-1)!important;height:100%!important;margin:0}.no-data-found.is-hidden{display:none!important}h5,div{color:var(--gauzy-text-color-1);font-weight:600;font-size:18px}div{color:var(--text-primary-color)}p{color:var(--gauzy-text-color-2)}.no-record-icon{transform:rotate(.75turn) scaleY(-1);font-size:48px}:host{height:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i0.ChangeDetectorRef }], propDecorators: { title: [{
                type: Input
            }], message: [{
                type: Input
            }], loading: [{
                type: Input
            }], variant: [{
                type: Input
            }], skeletonRows: [{
                type: Input
            }], settleDelay: [{
                type: Input
            }] } });
//# sourceMappingURL=no-data-message.component.js.map