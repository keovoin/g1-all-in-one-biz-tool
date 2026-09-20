import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
/** Rows rendered while loading when the host asks for no (or a nonsensical) count. */
const DEFAULT_SKELETON_ROWS = 3;
/**
 * Loading / error / empty wrapper shared by the list-shaped Teams widgets.
 *
 * The counter widgets get those three states from `ga-teams-counter-card`; the
 * team-card grid, the member list and the status chart need the same states
 * around arbitrary projected content, which is what this component provides.
 *
 * It renders no card: `ga-dashboard-widget-host` already owns the `nb-card`,
 * the header and the edit-mode menu.
 */
export class TeamsWidgetStateComponent {
    constructor() {
        /** Shows the skeleton rows instead of the content. */
        this.loading = input(false, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        /** Non-null switches the wrapper into its error state. */
        this.error = input(null, ...(ngDevMode ? [{ debugName: "error" }] : []));
        /** True when the (successfully loaded) content has nothing to show. */
        this.empty = input(false, ...(ngDevMode ? [{ debugName: "empty" }] : []));
        /** Translation key of the message rendered in the empty state. */
        this.emptyMessageKey = input('SM_TABLE.NO_DATA.TEAM_DASHBOARD', ...(ngDevMode ? [{ debugName: "emptyMessageKey" }] : []));
        /** How many skeleton rows to render while loading. */
        this.skeletonRows = input(DEFAULT_SKELETON_ROWS, ...(ngDevMode ? [{ debugName: "skeletonRows" }] : []));
        /** Emitted when the user asks for a re-fetch from the error state. */
        this.retry = output();
        /**
         * Range the template repeats the skeleton rows over.
         *
         * A `computed` rather than a getter: `@for` needs an iterable, and a getter
         * would allocate a fresh array on every change-detection pass — which also
         * makes the `track` identity churn.
         *
         * Non-finite input falls back to the default INSTEAD of being clamped, because
         * clamping cannot catch it: every comparison with `NaN` is false, so `NaN`
         * survives `Math.max`/`Math.min` unchanged and `Array.from({ length: NaN })`
         * yields an EMPTY array — a blank card where the loading state should be.
         */
        this.skeletonRange = computed(() => {
            const requested = this.skeletonRows();
            const rows = Number.isFinite(requested)
                ? Math.max(1, Math.min(Math.trunc(requested), 10))
                : DEFAULT_SKELETON_ROWS;
            return Array.from({ length: rows }, (_, index) => index);
        }, ...(ngDevMode ? [{ debugName: "skeletonRange" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsWidgetStateComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamsWidgetStateComponent, isStandalone: true, selector: "ga-teams-widget-state", inputs: { loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null }, empty: { classPropertyName: "empty", publicName: "empty", isSignal: true, isRequired: false, transformFunction: null }, emptyMessageKey: { classPropertyName: "emptyMessageKey", publicName: "emptyMessageKey", isSignal: true, isRequired: false, transformFunction: null }, skeletonRows: { classPropertyName: "skeletonRows", publicName: "skeletonRows", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { retry: "retry" }, ngImport: i0, template: "@if (error()) {\n\t<div class=\"widget-error\" role=\"alert\">\n\t\t<div class=\"widget-error-text\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<!--\n\t\t\t\t`aria-label` carries the DETAIL: the visible text is the generic\n\t\t\t\t\"Error\" label (the message is truncated to one line), and `title`\n\t\t\t\tonly surfaces on hover \u2014 which leaves keyboard and touch users, and\n\t\t\t\tevery screen reader, with no way to learn what actually failed.\n\t\t\t-->\n\t\t\t<span\n\t\t\t\tclass=\"widget-error-label\"\n\t\t\t\t[title]=\"error()\"\n\t\t\t\t[attr.aria-label]=\"('DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate) + ': ' + error()\"\n\t\t\t>\n\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate }}\n\t\t\t</span>\n\t\t</div>\n\t\t<button nbButton ghost size=\"tiny\" status=\"basic\" type=\"button\" (click)=\"retry.emit()\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.RETRY' | translate }}\n\t\t</button>\n\t</div>\n} @else if (loading()) {\n\t<!-- <output> carries an implicit `status` live region, so no explicit role. -->\n\t<output\n\t\tclass=\"widget-skeleton\"\n\t\taria-busy=\"true\"\n\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.WIDGETS.LOADING' | translate\"\n\t>\n\t\t@for (row of skeletonRange(); track row) {\n\t\t\t<!-- `span`, not `div`: `<output>` only accepts phrasing content. -->\n\t\t\t<span class=\"skeleton-line\"></span>\n\t\t}\n\t</output>\n} @else if (empty()) {\n\t<div class=\"widget-empty\">\n\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t<span>{{ emptyMessageKey() | translate }}</span>\n\t</div>\n} @else {\n\t<ng-content></ng-content>\n}\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}.widget-error{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem}.widget-error .widget-error-text{display:flex;align-items:center;gap:.375rem;color:var(--text-hint-color);font-size:12px;line-height:15px}.widget-error .widget-error-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.widget-error nb-icon{height:14px;width:14px}.widget-empty{display:flex;align-items:center;justify-content:center;gap:.5rem;height:100%;padding:1rem;text-align:center;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.widget-empty nb-icon{height:16px;width:16px;flex-shrink:0}.widget-skeleton{display:flex;flex-direction:column;gap:.75rem;width:100%}.widget-skeleton .skeleton-line{height:28px;width:100%;border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-2) 25%,var(--background-basic-color-3) 37%,var(--background-basic-color-2) 63%);background-size:400% 100%;animation:teams-widget-skeleton-shimmer 1.4s ease infinite}@media(prefers-reduced-motion:reduce){.widget-skeleton .skeleton-line{animation:none}}@keyframes teams-widget-skeleton-shimmer{0%{background-position:100% 50%}to{background-position:0 50%}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamsWidgetStateComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-teams-widget-state', standalone: true, imports: [NbButtonModule, NbIconModule, TranslateModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (error()) {\n\t<div class=\"widget-error\" role=\"alert\">\n\t\t<div class=\"widget-error-text\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<!--\n\t\t\t\t`aria-label` carries the DETAIL: the visible text is the generic\n\t\t\t\t\"Error\" label (the message is truncated to one line), and `title`\n\t\t\t\tonly surfaces on hover \u2014 which leaves keyboard and touch users, and\n\t\t\t\tevery screen reader, with no way to learn what actually failed.\n\t\t\t-->\n\t\t\t<span\n\t\t\t\tclass=\"widget-error-label\"\n\t\t\t\t[title]=\"error()\"\n\t\t\t\t[attr.aria-label]=\"('DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate) + ': ' + error()\"\n\t\t\t>\n\t\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.ERROR' | translate }}\n\t\t\t</span>\n\t\t</div>\n\t\t<button nbButton ghost size=\"tiny\" status=\"basic\" type=\"button\" (click)=\"retry.emit()\">\n\t\t\t{{ 'DASHBOARD_PAGE.BUILDER.WIDGETS.RETRY' | translate }}\n\t\t</button>\n\t</div>\n} @else if (loading()) {\n\t<!-- <output> carries an implicit `status` live region, so no explicit role. -->\n\t<output\n\t\tclass=\"widget-skeleton\"\n\t\taria-busy=\"true\"\n\t\t[attr.aria-label]=\"'DASHBOARD_PAGE.BUILDER.WIDGETS.LOADING' | translate\"\n\t>\n\t\t@for (row of skeletonRange(); track row) {\n\t\t\t<!-- `span`, not `div`: `<output>` only accepts phrasing content. -->\n\t\t\t<span class=\"skeleton-line\"></span>\n\t\t}\n\t</output>\n} @else if (empty()) {\n\t<div class=\"widget-empty\">\n\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t<span>{{ emptyMessageKey() | translate }}</span>\n\t</div>\n} @else {\n\t<ng-content></ng-content>\n}\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;overflow:hidden}.widget-error{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem}.widget-error .widget-error-text{display:flex;align-items:center;gap:.375rem;color:var(--text-hint-color);font-size:12px;line-height:15px}.widget-error .widget-error-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.widget-error nb-icon{height:14px;width:14px}.widget-empty{display:flex;align-items:center;justify-content:center;gap:.5rem;height:100%;padding:1rem;text-align:center;color:var(--text-hint-color);font-size:var(--text-caption-font-size)}.widget-empty nb-icon{height:16px;width:16px;flex-shrink:0}.widget-skeleton{display:flex;flex-direction:column;gap:.75rem;width:100%}.widget-skeleton .skeleton-line{height:28px;width:100%;border-radius:var(--border-radius);background:linear-gradient(90deg,var(--background-basic-color-2) 25%,var(--background-basic-color-3) 37%,var(--background-basic-color-2) 63%);background-size:400% 100%;animation:teams-widget-skeleton-shimmer 1.4s ease infinite}@media(prefers-reduced-motion:reduce){.widget-skeleton .skeleton-line{animation:none}}@keyframes teams-widget-skeleton-shimmer{0%{background-position:100% 50%}to{background-position:0 50%}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], error: [{ type: i0.Input, args: [{ isSignal: true, alias: "error", required: false }] }], empty: [{ type: i0.Input, args: [{ isSignal: true, alias: "empty", required: false }] }], emptyMessageKey: [{ type: i0.Input, args: [{ isSignal: true, alias: "emptyMessageKey", required: false }] }], skeletonRows: [{ type: i0.Input, args: [{ isSignal: true, alias: "skeletonRows", required: false }] }], retry: [{ type: i0.Output, args: ["retry"] }] } });
//# sourceMappingURL=teams-widget-state.component.js.map