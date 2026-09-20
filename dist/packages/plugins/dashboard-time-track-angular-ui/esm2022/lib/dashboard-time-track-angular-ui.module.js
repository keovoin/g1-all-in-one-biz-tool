import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbIconModule, NbListModule, NbPopoverModule, NbProgressBarModule, NbSpinnerModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PageExtensionSlotComponent } from '@gauzy/plugin-ui';
import { ActivityItemModule, CounterPointComponent, GalleryModule, ScreenshotsItemModule, SharedModule, TimezoneFilterModule, WidgetLayoutModule, WindowLayoutModule } from '@gauzy/ui-core/shared';
import { TimeTrackingComponent } from './components/time-tracking/time-tracking.component';
import { createTimeTrackingRoutes } from './dashboard-time-track-angular-ui.routes';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "ngx-permissions";
import * as i3 from "@ngx-translate/core";
// NB Modules
const NB_MODULES = [
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbListModule,
    NbPopoverModule,
    NbProgressBarModule,
    NbSpinnerModule,
    NbToggleModule,
    NbTooltipModule
];
// Standalone Modules
const STANDALONE_MODULES = [
    PageExtensionSlotComponent // Plugin extension slot for rendering React/Vue/etc widgets
];
export class DashboardTimeTrackAngularUiModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardTimeTrackAngularUiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DashboardTimeTrackAngularUiModule, declarations: [TimeTrackingComponent], imports: [i1.RouterModule, NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbListModule,
            NbPopoverModule,
            NbProgressBarModule,
            NbSpinnerModule,
            NbToggleModule,
            NbTooltipModule, PageExtensionSlotComponent // Plugin extension slot for rendering React/Vue/etc widgets
            , i2.NgxPermissionsModule, i3.TranslateModule, 
            // Feature Modules
            SharedModule,
            ActivityItemModule,
            CounterPointComponent,
            GalleryModule,
            ScreenshotsItemModule,
            TimezoneFilterModule,
            WidgetLayoutModule,
            WindowLayoutModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardTimeTrackAngularUiModule, providers: [
            {
                provide: ROUTES,
                useFactory: () => createTimeTrackingRoutes(),
                multi: true
            }
        ], imports: [RouterModule.forChild([]), NB_MODULES, STANDALONE_MODULES, NgxPermissionsModule.forChild(),
            TranslateModule.forChild(),
            // Feature Modules
            SharedModule,
            ActivityItemModule,
            CounterPointComponent,
            GalleryModule,
            ScreenshotsItemModule,
            TimezoneFilterModule,
            WidgetLayoutModule,
            WindowLayoutModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardTimeTrackAngularUiModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        RouterModule.forChild([]),
                        ...NB_MODULES,
                        ...STANDALONE_MODULES,
                        NgxPermissionsModule.forChild(),
                        TranslateModule.forChild(),
                        // Feature Modules
                        SharedModule,
                        ActivityItemModule,
                        CounterPointComponent,
                        GalleryModule,
                        ScreenshotsItemModule,
                        TimezoneFilterModule,
                        WidgetLayoutModule,
                        WindowLayoutModule
                    ],
                    declarations: [TimeTrackingComponent],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: () => createTimeTrackingRoutes(),
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=dashboard-time-track-angular-ui.module.js.map