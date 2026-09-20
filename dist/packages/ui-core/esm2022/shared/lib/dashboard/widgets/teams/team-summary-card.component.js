import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NbBadgeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CounterPointComponent } from '../../../counter-point/counter-point.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
/**
 * Headline of one team: working members over total, the team's name, and the
 * working-now / working-today / not-working legend.
 *
 * Extracted from the masonry card header of the legacy Teams dashboard (which
 * merges `gauzy-team-card` and the per-team header of `gauzy-all-team`) and
 * shared by the Team Cards grid and the per-team overview, so the two cannot
 * disagree about what a team's numbers look like.
 *
 * Purely presentational: it fetches nothing and owns no state.
 */
export class TeamSummaryCardComponent {
    constructor() {
        /** The team to summarize. */
        this.team = input.required(...(ngDevMode ? [{ debugName: "team" }] : []));
        /**
         * Whether to draw the counter-point strip under the legend.
         *
         * The overview widget hides it: there the strip sits directly above the team's
         * own member rows, which already convey the same working/idle split.
         */
        this.showCounter = input(true, ...(ngDevMode ? [{ debugName: "showCounter" }] : []));
        /**
         * Members that logged time but have no timer running right now.
         *
         * Computed rather than subtracted in the template because the difference can
         * go negative for a fraction of a second while a snapshot is being replaced,
         * and a "-1" badge is worse than a "0" one.
         */
        this.workingToday = computed(() => Math.max(this.team().countWorking - this.team().countOnline, 0), ...(ngDevMode ? [{ debugName: "workingToday" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamSummaryCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TeamSummaryCardComponent, isStandalone: true, selector: "ga-team-summary-card", inputs: { team: { classPropertyName: "team", publicName: "team", isSignal: true, isRequired: true, transformFunction: null }, showCounter: { classPropertyName: "showCounter", publicName: "showCounter", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<div class=\"team-card-headline\">\n\t<div class=\"h1 team-card-value\">{{ team().countWorking }}</div>\n\t<div class=\"team-card-total\">/{{ team().countTotal }}</div>\n</div>\n\n<div class=\"team-card-name\" [title]=\"team().name\">{{ team().name }}</div>\n\n<div class=\"team-card-legend\">\n\t<nb-badge\n\t\tstatus=\"success\"\n\t\t[text]=\"('DASHBOARD_PAGE.CHARTS.WORKING_NOW' | translate) + ' ' + team().countOnline\"\n\t></nb-badge>\n\t<nb-badge\n\t\tstatus=\"warning\"\n\t\t[text]=\"('DASHBOARD_PAGE.CHARTS.WORKING_TODAY' | translate) + ' ' + workingToday()\"\n\t></nb-badge>\n\t<nb-badge\n\t\tstatus=\"danger\"\n\t\t[text]=\"('DASHBOARD_PAGE.CHARTS.NOT_WORKING' | translate) + ' ' + team().countNotWorking\"\n\t></nb-badge>\n</div>\n\n@if (showCounter()) {\n\t<div class=\"team-card-counter\">\n\t\t<gauzy-counter-point [total]=\"team().countTotal\" [value]=\"team().countWorking\"></gauzy-counter-point>\n\t</div>\n}\n", styles: [":host{display:flex;flex-direction:column;gap:.375rem;padding:.75rem;min-width:0;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.team-card-headline{display:flex;align-items:center;gap:.25rem;min-width:0}.team-card-value{margin-bottom:0}.team-card-total{color:var(--text-hint-color);white-space:nowrap}.team-card-name{color:var(--text-basic-color);font-size:var(--text-subtitle-2-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.team-card-legend{display:flex;flex-wrap:wrap;gap:.375rem}.team-card-legend nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.team-card-counter{margin-top:auto;padding-top:.25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbBadgeModule }, { kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "component", type: CounterPointComponent, selector: "gauzy-counter-point", inputs: ["total", "value", "color", "progress"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TeamSummaryCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-team-summary-card', standalone: true, imports: [NbBadgeModule, TranslateModule, CounterPointComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"team-card-headline\">\n\t<div class=\"h1 team-card-value\">{{ team().countWorking }}</div>\n\t<div class=\"team-card-total\">/{{ team().countTotal }}</div>\n</div>\n\n<div class=\"team-card-name\" [title]=\"team().name\">{{ team().name }}</div>\n\n<div class=\"team-card-legend\">\n\t<nb-badge\n\t\tstatus=\"success\"\n\t\t[text]=\"('DASHBOARD_PAGE.CHARTS.WORKING_NOW' | translate) + ' ' + team().countOnline\"\n\t></nb-badge>\n\t<nb-badge\n\t\tstatus=\"warning\"\n\t\t[text]=\"('DASHBOARD_PAGE.CHARTS.WORKING_TODAY' | translate) + ' ' + workingToday()\"\n\t></nb-badge>\n\t<nb-badge\n\t\tstatus=\"danger\"\n\t\t[text]=\"('DASHBOARD_PAGE.CHARTS.NOT_WORKING' | translate) + ' ' + team().countNotWorking\"\n\t></nb-badge>\n</div>\n\n@if (showCounter()) {\n\t<div class=\"team-card-counter\">\n\t\t<gauzy-counter-point [total]=\"team().countTotal\" [value]=\"team().countWorking\"></gauzy-counter-point>\n\t</div>\n}\n", styles: [":host{display:flex;flex-direction:column;gap:.375rem;padding:.75rem;min-width:0;border-radius:var(--border-radius);background-color:var(--background-basic-color-2)}.team-card-headline{display:flex;align-items:center;gap:.25rem;min-width:0}.team-card-value{margin-bottom:0}.team-card-total{color:var(--text-hint-color);white-space:nowrap}.team-card-name{color:var(--text-basic-color);font-size:var(--text-subtitle-2-font-size);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.team-card-legend{display:flex;flex-wrap:wrap;gap:.375rem}.team-card-legend nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.team-card-counter{margin-top:auto;padding-top:.25rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { team: [{ type: i0.Input, args: [{ isSignal: true, alias: "team", required: true }] }], showCounter: [{ type: i0.Input, args: [{ isSignal: true, alias: "showCounter", required: false }] }] } });
//# sourceMappingURL=team-summary-card.component.js.map