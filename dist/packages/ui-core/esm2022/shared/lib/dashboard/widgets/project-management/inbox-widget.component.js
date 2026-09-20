import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import { TeamsWidgetStateComponent } from '../teams/teams-widget-state.component';
import * as i0 from "@angular/core";
/**
 * The Project Management dashboard's "Inbox" panel.
 *
 * The panel is a placeholder on the legacy page too — it renders `ga-wip`
 * ("coming soon") and has no data source — so this widget is the same promise in
 * widget form, and it says so both in the card and in the palette description.
 *
 * It reuses `ga-teams-widget-state`'s empty state rather than `ga-wip` itself:
 * `ga-wip` is only declared by `WorkInProgressModule`, and that module also
 * contributes a multi-provided `ROUTES` entry (a `path: ''` route). Importing it
 * into a standalone widget would inject that route into the injector the widget
 * is created in — a routing side effect a dashboard card has no business having.
 *
 * It fetches nothing, so it opts out of the base class' context-driven refresh.
 */
export class InboxWidgetComponent extends BaseDashboardWidgetComponent {
    constructor() {
        super(...arguments);
        /** Nothing to fetch, so the ambient context is irrelevant. */
        this.refreshOnContextChange = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InboxWidgetComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: InboxWidgetComponent, isStandalone: true, selector: "ga-pm-inbox-widget", usesInheritance: true, ngImport: i0, template: "<!--\n\tAlways the empty state: the inbox has no data source yet. `loading` and\n\t`error` stay false so the card never shows a skeleton it would never leave.\n-->\n<ga-teams-widget-state\n\t[empty]=\"true\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.INBOX.EMPTY\"\n></ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}\n"], dependencies: [{ kind: "component", type: TeamsWidgetStateComponent, selector: "ga-teams-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InboxWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-pm-inbox-widget', standalone: true, imports: [TeamsWidgetStateComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n\tAlways the empty state: the inbox has no data source yet. `loading` and\n\t`error` stay false so the card never shows a skeleton it would never leave.\n-->\n<ga-teams-widget-state\n\t[empty]=\"true\"\n\temptyMessageKey=\"DASHBOARD_PAGE.BUILDER.WIDGETS.PROJECT_MANAGEMENT.INBOX.EMPTY\"\n></ga-teams-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0}\n"] }]
        }] });
//# sourceMappingURL=inbox-widget.component.js.map