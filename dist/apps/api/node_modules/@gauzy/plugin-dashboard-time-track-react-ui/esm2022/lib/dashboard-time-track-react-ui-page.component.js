import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { NbCardModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PageExtensionSlotComponent } from '@gauzy/plugin-ui';
import { DateRangePickerBuilderService } from '@gauzy/ui-core/core';
import { ComponentsModule } from '@gauzy/ui-core/shared';
import { ReactHostDirective } from '@gauzy/ui-react';
import { DashboardTimeTrackReactUiPage } from './components/DashboardTimeTrackReactUiPage';
import { headerTitleKey } from './utils/period.utils';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/shared";
import * as i3 from "@ngx-translate/core";
/**
 * DashboardTimeTrackReactUiPageComponent
 *
 * The routed Angular host of the React Time Tracking dashboard. It owns ONLY the page chrome the
 * Angular tab gets from the app shell — the `nb-card` with the `<h4><ngx-header-title>` title
 * (period prefix + "Time Tracking" + " for <Org>" + breadcrumb trail) and the two header rows —
 * and mounts the React root ONCE in the card body via `[gaReactHost]`. The React root renders the
 * header controls (timezone filter, Manage widgets, Auto Refresh, Refresh) into the two header
 * slots below through portals, so the header reads exactly like the Angular flavour while every
 * control is React.
 *
 * `props` is built once in `ngOnInit` (the slot elements are `static: true` view children), not
 * in the template — a fresh object per change-detection pass would re-render the React root on
 * every tick.
 */
export class DashboardTimeTrackReactUiPageComponent {
    constructor() {
        this.dateRangePickerBuilderService = inject(DateRangePickerBuilderService);
        /** The React root component. */
        this.page = DashboardTimeTrackReactUiPage;
        /** Built once in `ngOnInit`; see the class doc. */
        this.props = {};
        /**
         * `TIMESHEET.DAILY | WEEKLY | MONTHLY` — the same prefix `TimeTrackingComponent.headerTitle`
         * derives from the selected date range (`null` for a custom range, like Angular).
         */
        this.headerTitleKey = toSignal(this.dateRangePickerBuilderService.selectedDateRange$.pipe(map((range) => headerTitleKey(range))), { initialValue: headerTitleKey(this.dateRangePickerBuilderService.selectedDateRange) });
    }
    ngOnInit() {
        this.props = {
            headerActionsHost: this.headerActions.nativeElement,
            headerToolbarHost: this.headerToolbar.nativeElement
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardTimeTrackReactUiPageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DashboardTimeTrackReactUiPageComponent, isStandalone: true, selector: "gz-dashboard-time-track-react-ui-page", viewQueries: [{ propertyName: "headerActions", first: true, predicate: ["headerActions"], descendants: true, static: true }, { propertyName: "headerToolbar", first: true, predicate: ["headerToolbar"], descendants: true, static: true }], ngImport: i0, template: `
		<nb-card class="card">
			<nb-card-header class="card-header">
				<div class="row">
					<div class="col-auto">
						<h4>
							<ngx-header-title>
								@if (headerTitleKey(); as key) {
									{{ key | translate }}
								}
								{{ 'TIMESHEET.TIME_TRACKING' | translate }}
							</ngx-header-title>
						</h4>
					</div>
					<div class="mb-4 ml-auto col-auto d-flex align-items-center" #headerActions></div>
				</div>
				<div class="row">
					<div class="mb-2 ml-auto col-auto d-flex align-items-center" #headerToolbar></div>
				</div>
			</nb-card-header>
			<nb-card-body class="card-body">
				<div [gaReactHost]="page" [props]="props"></div>
				<!-- Plugin Extension Slots (React, Vue, …) — the Angular tab renders the same two. -->
				<ga-page-extension-slot slotId="dashboard-widgets"></ga-page-extension-slot>
				<ga-page-extension-slot slotId="dashboard-windows"></ga-page-extension-slot>
			</nb-card-body>
		</nb-card>
	`, isInline: true, styles: [":host{display:block}:host .card{background-color:var(--gauzy-card-2);height:auto}:host .card-header{background-color:unset}:host .card-body{background-color:var(--gauzy-card-2);padding:1rem .5rem 1rem 18px;border-radius:0 0 var(--border-radius) var(--border-radius);height:auto!important}:host-context([dir=\"rtl\"]) .card-body{padding:1rem 18px 1rem .5rem}\n"], dependencies: [{ kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: ComponentsModule }, { kind: "component", type: i2.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "component", type: PageExtensionSlotComponent, selector: "ga-page-extension-slot", inputs: ["slotId", "extensionClass", "defaultWrapper", "visibilityContext", "contextData", "reactive"] }, { kind: "directive", type: ReactHostDirective, selector: "[gaReactHost]", inputs: ["gaReactHost", "props", "context"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardTimeTrackReactUiPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-dashboard-time-track-react-ui-page', standalone: true, imports: [NbCardModule, TranslateModule, ComponentsModule, PageExtensionSlotComponent, ReactHostDirective], changeDetection: ChangeDetectionStrategy.OnPush, template: `
		<nb-card class="card">
			<nb-card-header class="card-header">
				<div class="row">
					<div class="col-auto">
						<h4>
							<ngx-header-title>
								@if (headerTitleKey(); as key) {
									{{ key | translate }}
								}
								{{ 'TIMESHEET.TIME_TRACKING' | translate }}
							</ngx-header-title>
						</h4>
					</div>
					<div class="mb-4 ml-auto col-auto d-flex align-items-center" #headerActions></div>
				</div>
				<div class="row">
					<div class="mb-2 ml-auto col-auto d-flex align-items-center" #headerToolbar></div>
				</div>
			</nb-card-header>
			<nb-card-body class="card-body">
				<div [gaReactHost]="page" [props]="props"></div>
				<!-- Plugin Extension Slots (React, Vue, …) — the Angular tab renders the same two. -->
				<ga-page-extension-slot slotId="dashboard-widgets"></ga-page-extension-slot>
				<ga-page-extension-slot slotId="dashboard-windows"></ga-page-extension-slot>
			</nb-card-body>
		</nb-card>
	`, styles: [":host{display:block}:host .card{background-color:var(--gauzy-card-2);height:auto}:host .card-header{background-color:unset}:host .card-body{background-color:var(--gauzy-card-2);padding:1rem .5rem 1rem 18px;border-radius:0 0 var(--border-radius) var(--border-radius);height:auto!important}:host-context([dir=\"rtl\"]) .card-body{padding:1rem 18px 1rem .5rem}\n"] }]
        }], propDecorators: { headerActions: [{
                type: ViewChild,
                args: ['headerActions', { static: true }]
            }], headerToolbar: [{
                type: ViewChild,
                args: ['headerToolbar', { static: true }]
            }] } });
//# sourceMappingURL=dashboard-time-track-react-ui-page.component.js.map