import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NbButtonModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { normalizeDurationPercentage } from '@gauzy/ui-core/core';
import { ActivityItemModule } from '@gauzy/ui-core/shared';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import { TimeTrackWidgetStateComponent } from './time-track-widget-state.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/shared";
import * as i3 from "@ngx-translate/core";
/**
 * List widget: which applications and URLs the tracked time was spent in.
 *
 * Wraps the legacy dashboard's "Apps & URLs" window, and reuses the very same
 * row component (`ngx-activity-item` in its `isDashboard` mode) rather than
 * re-implementing the title / share / duration layout.
 */
export class AppsUrlsWidgetComponent extends BaseTimeTrackListWidgetComponent {
    constructor() {
        super(...arguments);
        this._router = inject(Router);
        /** @inheritdoc */
        this.emptyMessageBaseKey = 'TIMESHEET.NO_APP_URL_ACTIVITY';
    }
    /**
     * Reads the app / URL activity buckets for the current scope.
     *
     * The share each row renders is the one the API computed against the whole
     * reporting period, not one re-derived from the five rows it returned — see
     * {@link normalizeDurationPercentage} for why the legacy dashboard's local
     * re-computation inflates every row. The helper only makes that server value
     * renderable (finite, clamped).
     *
     * @param context - The dashboard context to query for.
     * @returns The activity rows with a renderable `durationPercentage`.
     */
    fetch(context) {
        return this.statisticsCache
            .getActivities(context)
            .pipe(map((activities) => normalizeDurationPercentage(activities)));
    }
    /**
     * Opens the Apps & URLs report for the widget's own reporting window.
     *
     * The range comes from the widget context rather than the page selectors: a
     * canvas widget may be pinned to a range the header no longer shows.
     */
    openReport() {
        const context = this.widgetContext();
        if (!context) {
            return;
        }
        this._router.navigate(['/pages/reports/apps-urls'], {
            queryParams: {
                date: moment(context.startDate).format('MM-DD-YYYY'),
                date_end: moment(context.endDate).format('MM-DD-YYYY')
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppsUrlsWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: AppsUrlsWidgetComponent, isStandalone: true, selector: "gz-apps-urls-widget", usesInheritance: true, ngImport: i0, template: "<gz-time-track-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t[empty]=\"isEmpty()\"\n\t[emptyMessageKey]=\"emptyMessageKey()\"\n\t[skeletonRows]=\"5\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"list-panel\">\n\t\t<div class=\"list-actions\">\n\t\t\t<button nbButton ghost size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"openReport()\">\n\t\t\t\t{{ 'BUTTONS.VIEW_REPORT' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"list-scroll\">\n\t\t\t<!--\n\t\t\t\t`$index`, not the title: an activity bucket carries no id, and two\n\t\t\t\trows CAN share a title \u2014 which `@for` rejects at runtime as a\n\t\t\t\tduplicate key. The whole array is replaced on every fetch anyway, so\n\t\t\t\tthere is no identity to preserve.\n\t\t\t-->\n\t\t\t@for (activity of rows(); track $index) {\n\t\t\t\t<div class=\"list-row activity-row\">\n\t\t\t\t\t<ngx-activity-item [item]=\"activity\" [isDashboard]=\"true\"></ngx-activity-item>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</gz-time-track-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:time-track-list-widget}.list-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0;font-size:12px;line-height:15px}.list-actions{display:flex;justify-content:flex-end;flex:0 0 auto}.list-actions button{font-size:12px;line-height:15px}.list-scroll{display:flex;flex-direction:column;gap:0;flex:1 1 auto;min-height:0;overflow-y:auto}.list-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-3);color:var(--text-hint-color);font-size:12px;line-height:15px;font-weight:var(--text-subtitle-2-font-weight);gap:.5rem;padding:var(--gauzy-table-header-padding-y) var(--gauzy-table-header-padding-x);border-radius:var(--gauzy-radius-sm);margin-bottom:2px}.list-row{align-items:center;gap:.5rem;padding:.875rem var(--gauzy-table-cell-padding-x);color:var(--gauzy-text-color-1);border-bottom:1px solid var(--gauzy-border-default-color);font-size:12px;line-height:15px;transition:background-color .15s ease-in-out}.list-row:last-child{border-bottom:none}.list-row:hover{background-color:var(--gauzy-hover-tint)}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-muted{color:var(--text-hint-color);font-size:12px;line-height:15px}.cell-numeric{white-space:nowrap;text-align:right}.cell-center{text-align:center}.cell-progress{display:flex;align-items:center;gap:.5rem;min-width:0}.cell-progress .progress-value{flex:0 0 auto;color:var(--text-hint-color);font-size:12px;line-height:15px;white-space:nowrap}.cell-progress nb-progress-bar{flex:1 1 auto;min-width:0}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:5px}.manual-time-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1.2fr) auto auto}.progress-row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) auto}.member-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.2fr)}.member-metric{display:flex;flex-direction:column;align-items:center;gap:.125rem;min-width:0}.member-metric .metric-duration{font-size:12px;line-height:15px;white-space:nowrap}.member-metric nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.member-week{display:flex;align-items:center;justify-content:center;gap:.5rem;min-width:0}.member-week-graph{display:flex;align-items:flex-end;gap:2px;height:28px;flex:0 0 auto}.member-week-graph .bar-graph-entry{width:4px;min-height:2px;border-radius:1px;background-color:var(--color-primary-default)}.activity-row{display:block;padding:.875rem var(--gauzy-table-cell-padding-x)}:host ::ng-deep ngx-activity-item .child,:host ::ng-deep ngx-activity-item .no-child{font-size:12px;line-height:15px}:host ::ng-deep ngx-activity-item .times,:host ::ng-deep ngx-activity-item .percentage-col,:host ::ng-deep ngx-activity-item .duration{font-size:12px;line-height:15px}@container time-track-list-widget (max-width: 420px){.manual-time-row{grid-template-columns:minmax(0,1.4fr) auto auto}.manual-time-date{display:none}.progress-row{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.member-week-graph{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: ActivityItemModule }, { kind: "component", type: i2.ActivityItemComponent, selector: "ngx-activity-item", inputs: ["allowChild", "isDashboard", "item", "visitedDate"], outputs: ["loadChild"] }, { kind: "component", type: TimeTrackWidgetStateComponent, selector: "gz-time-track-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppsUrlsWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-apps-urls-widget', standalone: true, imports: [NbButtonModule, TranslateModule, ActivityItemModule, TimeTrackWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t[empty]=\"isEmpty()\"\n\t[emptyMessageKey]=\"emptyMessageKey()\"\n\t[skeletonRows]=\"5\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"list-panel\">\n\t\t<div class=\"list-actions\">\n\t\t\t<button nbButton ghost size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"openReport()\">\n\t\t\t\t{{ 'BUTTONS.VIEW_REPORT' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"list-scroll\">\n\t\t\t<!--\n\t\t\t\t`$index`, not the title: an activity bucket carries no id, and two\n\t\t\t\trows CAN share a title \u2014 which `@for` rejects at runtime as a\n\t\t\t\tduplicate key. The whole array is replaced on every fetch anyway, so\n\t\t\t\tthere is no identity to preserve.\n\t\t\t-->\n\t\t\t@for (activity of rows(); track $index) {\n\t\t\t\t<div class=\"list-row activity-row\">\n\t\t\t\t\t<ngx-activity-item [item]=\"activity\" [isDashboard]=\"true\"></ngx-activity-item>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</gz-time-track-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:time-track-list-widget}.list-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0;font-size:12px;line-height:15px}.list-actions{display:flex;justify-content:flex-end;flex:0 0 auto}.list-actions button{font-size:12px;line-height:15px}.list-scroll{display:flex;flex-direction:column;gap:0;flex:1 1 auto;min-height:0;overflow-y:auto}.list-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-3);color:var(--text-hint-color);font-size:12px;line-height:15px;font-weight:var(--text-subtitle-2-font-weight);gap:.5rem;padding:var(--gauzy-table-header-padding-y) var(--gauzy-table-header-padding-x);border-radius:var(--gauzy-radius-sm);margin-bottom:2px}.list-row{align-items:center;gap:.5rem;padding:.875rem var(--gauzy-table-cell-padding-x);color:var(--gauzy-text-color-1);border-bottom:1px solid var(--gauzy-border-default-color);font-size:12px;line-height:15px;transition:background-color .15s ease-in-out}.list-row:last-child{border-bottom:none}.list-row:hover{background-color:var(--gauzy-hover-tint)}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-muted{color:var(--text-hint-color);font-size:12px;line-height:15px}.cell-numeric{white-space:nowrap;text-align:right}.cell-center{text-align:center}.cell-progress{display:flex;align-items:center;gap:.5rem;min-width:0}.cell-progress .progress-value{flex:0 0 auto;color:var(--text-hint-color);font-size:12px;line-height:15px;white-space:nowrap}.cell-progress nb-progress-bar{flex:1 1 auto;min-width:0}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:5px}.manual-time-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1.2fr) auto auto}.progress-row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) auto}.member-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.2fr)}.member-metric{display:flex;flex-direction:column;align-items:center;gap:.125rem;min-width:0}.member-metric .metric-duration{font-size:12px;line-height:15px;white-space:nowrap}.member-metric nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.member-week{display:flex;align-items:center;justify-content:center;gap:.5rem;min-width:0}.member-week-graph{display:flex;align-items:flex-end;gap:2px;height:28px;flex:0 0 auto}.member-week-graph .bar-graph-entry{width:4px;min-height:2px;border-radius:1px;background-color:var(--color-primary-default)}.activity-row{display:block;padding:.875rem var(--gauzy-table-cell-padding-x)}:host ::ng-deep ngx-activity-item .child,:host ::ng-deep ngx-activity-item .no-child{font-size:12px;line-height:15px}:host ::ng-deep ngx-activity-item .times,:host ::ng-deep ngx-activity-item .percentage-col,:host ::ng-deep ngx-activity-item .duration{font-size:12px;line-height:15px}@container time-track-list-widget (max-width: 420px){.manual-time-row{grid-template-columns:minmax(0,1.4fr) auto auto}.manual-time-date{display:none}.progress-row{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.member-week-graph{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=apps-urls-widget.component.js.map