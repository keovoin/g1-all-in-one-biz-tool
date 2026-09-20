import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { SingleStatisticModule } from '../../../single-statistic/single-statistic.module';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../../single-statistic/single-statistic.component";
import * as i3 from "@ngx-translate/core";
/**
 * Presentational body shared by the four Accounting KPI widgets.
 *
 * It renders the existing `<ga-single-statistic>` — the very component the
 * Accounting dashboard page uses — and adds the three states a canvas-hosted
 * widget needs but that page never had: a loading skeleton, a recoverable error
 * state, and an "unavailable" hint (the bonus KPI is meaningless for an
 * organization with no bonus type configured).
 *
 * It deliberately renders NO card and NO title: on a canvas every widget is
 * already wrapped by `<ga-dashboard-widget-host>`, which owns the `nb-card`, the
 * header title and the edit-mode menu. Rendering our own would nest a card in a
 * card and print the title twice — which is also why the statistic's own title
 * slot is collapsed in the stylesheet instead of being fed a duplicate label.
 *
 * Purely presentational on purpose — all fetching and currency formatting live
 * in `BaseAccountingWidgetComponent`, so this component stays trivially reusable
 * by any future money KPI.
 */
export class AccountingStatisticCardComponent {
    constructor() {
        /**
         * Already formatted headline figure (`"$1,234.00"`, `"1 234,00 €"`).
         *
         * A string, not a number: currency formatting depends on the organization's
         * currency AND its currency position, both of which the widget resolves from
         * the dashboard context.
         */
        this.value = input('', ...(ngDevMode ? [{ debugName: "value" }] : []));
        /**
         * Colour of the figure, as a CSS custom property reference
         * (`var(--color-info-default)`), so the KPI stays correct in every theme.
         *
         * Ignored when {@link type} is `highlight`, which the statistic component
         * renders in its own success colour.
         */
        this.color = input('', ...(ngDevMode ? [{ debugName: "color" }] : []));
        /** `ga-single-statistic` display variant; `highlight` renders the success style. */
        this.type = input('', ...(ngDevMode ? [{ debugName: "type" }] : []));
        /** Shows the skeleton instead of the value. */
        this.loading = input(false, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        /** Non-null switches the card into its error state. */
        this.error = input(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        /**
         * Translation key of a hint replacing the value when the KPI cannot apply to
         * the current organization. `null` — the default — renders the value.
         */
        this.unavailableKey = input(null, ...(ngDevMode ? [{ debugName: "unavailableKey" }] : []));
        /** Emitted when the user asks for a re-fetch from the error state. */
        this.retry = output();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AccountingStatisticCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: AccountingStatisticCardComponent, isStandalone: true, selector: "ga-accounting-statistic-card", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null }, unavailableKey: { classPropertyName: "unavailableKey", publicName: "unavailableKey", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { retry: "retry" }, ngImport: i0, template: "@if (error()) {\n\t<div class=\"statistic-error\" role=\"alert\">\n\t\t<div class=\"statistic-error-text\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<!-- The visible label stays generic so a narrow widget cell never\n\t\t\t\toverflows, but the detail is REAL DOM text (visually hidden), not a\n\t\t\t\t`title`/`aria-label` only: those are unavailable to keyboard and many\n\t\t\t\ttouch users, and the surrounding role=\"alert\" announces text content. -->\n\t\t\t<span class=\"statistic-error-label\" [title]=\"error()\">\n\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate }}\n\t\t\t</span>\n\t\t\t<span class=\"statistic-error-detail\">{{ error() }}</span>\n\t\t</div>\n\t\t<button nbButton ghost size=\"tiny\" status=\"basic\" type=\"button\" (click)=\"retry.emit()\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.RETRY' | translate }}\n\t\t</button>\n\t</div>\n} @else if (loading()) {\n\t<!-- <output> carries an implicit `status` live region, so no explicit role. -->\n\t<output\n\t\tclass=\"statistic-skeleton\"\n\t\taria-busy=\"true\"\n\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.WIDGETS.LOADING' | translate\"\n\t>\n\t\t<!-- `span`, not `div`: `<output>` only accepts phrasing content. -->\n\t\t<span class=\"skeleton-line skeleton-value\"></span>\n\t</output>\n} @else if (unavailableKey(); as unavailable) {\n\t<p class=\"statistic-unavailable\">{{ unavailable | translate }}</p>\n} @else {\n\t<ga-single-statistic [value]=\"value()\" [color]=\"color()\" [type]=\"type()\"></ga-single-statistic>\n}\n", styles: [":host{display:flex;flex-direction:column;justify-content:center;height:100%;width:100%;min-width:0;overflow:hidden}:host ::ng-deep ga-single-statistic .statistic-component{display:flex;width:100%;min-width:0}:host ::ng-deep ga-single-statistic .title{display:none}:host ::ng-deep ga-single-statistic .content{margin-bottom:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.statistic-skeleton{display:flex;flex-direction:column;gap:.75rem}.statistic-skeleton .skeleton-line{border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-2) 25%,var(--background-basic-color-3) 37%,var(--background-basic-color-2) 63%);background-size:400% 100%;animation:accounting-skeleton-shimmer 1.4s ease infinite}.statistic-skeleton .skeleton-value{height:2rem;width:60%}@media(prefers-reduced-motion:reduce){.statistic-skeleton .skeleton-line{animation:none}}@keyframes accounting-skeleton-shimmer{0%{background-position:100% 50%}to{background-position:0 50%}}.statistic-unavailable{margin:0;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.statistic-error{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem}.statistic-error .statistic-error-text{display:flex;align-items:center;gap:.375rem;color:var(--text-hint-color);font-size:12px;line-height:15px}.statistic-error .statistic-error-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.statistic-error .statistic-error-detail{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.statistic-error nb-icon{height:14px;width:14px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: SingleStatisticModule }, { kind: "component", type: i2.SingleStatisticComponent, selector: "ga-single-statistic", inputs: ["title", "prefix", "value", "suffix", "type", "color"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AccountingStatisticCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-accounting-statistic-card', standalone: true, imports: [NbButtonModule, NbIconModule, TranslateModule, SingleStatisticModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (error()) {\n\t<div class=\"statistic-error\" role=\"alert\">\n\t\t<div class=\"statistic-error-text\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<!-- The visible label stays generic so a narrow widget cell never\n\t\t\t\toverflows, but the detail is REAL DOM text (visually hidden), not a\n\t\t\t\t`title`/`aria-label` only: those are unavailable to keyboard and many\n\t\t\t\ttouch users, and the surrounding role=\"alert\" announces text content. -->\n\t\t\t<span class=\"statistic-error-label\" [title]=\"error()\">\n\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate }}\n\t\t\t</span>\n\t\t\t<span class=\"statistic-error-detail\">{{ error() }}</span>\n\t\t</div>\n\t\t<button nbButton ghost size=\"tiny\" status=\"basic\" type=\"button\" (click)=\"retry.emit()\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.RETRY' | translate }}\n\t\t</button>\n\t</div>\n} @else if (loading()) {\n\t<!-- <output> carries an implicit `status` live region, so no explicit role. -->\n\t<output\n\t\tclass=\"statistic-skeleton\"\n\t\taria-busy=\"true\"\n\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.WIDGETS.LOADING' | translate\"\n\t>\n\t\t<!-- `span`, not `div`: `<output>` only accepts phrasing content. -->\n\t\t<span class=\"skeleton-line skeleton-value\"></span>\n\t</output>\n} @else if (unavailableKey(); as unavailable) {\n\t<p class=\"statistic-unavailable\">{{ unavailable | translate }}</p>\n} @else {\n\t<ga-single-statistic [value]=\"value()\" [color]=\"color()\" [type]=\"type()\"></ga-single-statistic>\n}\n", styles: [":host{display:flex;flex-direction:column;justify-content:center;height:100%;width:100%;min-width:0;overflow:hidden}:host ::ng-deep ga-single-statistic .statistic-component{display:flex;width:100%;min-width:0}:host ::ng-deep ga-single-statistic .title{display:none}:host ::ng-deep ga-single-statistic .content{margin-bottom:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.statistic-skeleton{display:flex;flex-direction:column;gap:.75rem}.statistic-skeleton .skeleton-line{border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-2) 25%,var(--background-basic-color-3) 37%,var(--background-basic-color-2) 63%);background-size:400% 100%;animation:accounting-skeleton-shimmer 1.4s ease infinite}.statistic-skeleton .skeleton-value{height:2rem;width:60%}@media(prefers-reduced-motion:reduce){.statistic-skeleton .skeleton-line{animation:none}}@keyframes accounting-skeleton-shimmer{0%{background-position:100% 50%}to{background-position:0 50%}}.statistic-unavailable{margin:0;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.statistic-error{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem}.statistic-error .statistic-error-text{display:flex;align-items:center;gap:.375rem;color:var(--text-hint-color);font-size:12px;line-height:15px}.statistic-error .statistic-error-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.statistic-error .statistic-error-detail{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.statistic-error nb-icon{height:14px;width:14px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], error: [{ type: i0.Input, args: [{ isSignal: true, alias: "error", required: false }] }], unavailableKey: [{ type: i0.Input, args: [{ isSignal: true, alias: "unavailableKey", required: false }] }], retry: [{ type: i0.Output, args: ["retry"] }] } });
//# sourceMappingURL=accounting-statistic-card.component.js.map