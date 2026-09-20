import { inject, NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { NbActionsModule, NbButtonModule, NbCalendarKitModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbIconModule, NbInputModule, NbRouteTabsetModule, NbTabsetModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { LoggerService, NavMenuBuilderService, PageRouteRegistryService } from '@gauzy/ui-core/core';
import { SmartDataViewLayoutModule, SelectorsModule, SharedModule, TableComponentsModule } from '@gauzy/ui-core/shared';
import { UpworkComponent } from './components/upwork/upwork.component';
import { UpworkAuthorizeComponent } from './components/upwork-authorize/upwork-authorize.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { ReportsComponent } from './components/reports/reports.component';
import { IntegrationUpworkLayoutComponent } from './integration-upwork.layout.component';
import { SyncDataSelectionComponent } from './components/sync-data-selection/sync-data-selection.component';
import { getUpworkRoutes } from './integration-upwork.routes';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
const NB_MODULES = [
    NbActionsModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRouteTabsetModule,
    NbTabsetModule,
    NbToggleModule,
    NbTooltipModule
];
export class IntegrationUpworkUiModule {
    constructor() {
        this._hasAppliedRegistrations = false;
        this._log = inject(LoggerService).withContext('IntegrationUpworkUiModule');
        this._navMenuBuilderService = inject(NavMenuBuilderService);
        this._pageRouteRegistryService = inject(PageRouteRegistryService);
        this._pluginDefinition = inject(PLUGIN_DEFINITION, { optional: true });
    }
    // ─── Plugin Lifecycle ─────────────────────────────────────────
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap() {
        this._log.log('Plugin bootstrapped');
        this._applyDeclarativeRegistrations();
    }
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy() {
        this._log.log('Plugin destroyed');
        this._hasAppliedRegistrations = false;
    }
    // ─── Registration ─────────────────────────────────────────────
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    _applyDeclarativeRegistrations() {
        if (this._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            navBuilder: this._navMenuBuilderService,
            pageRouteRegistry: this._pageRouteRegistryService
        });
        this._hasAppliedRegistrations = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationUpworkUiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: IntegrationUpworkUiModule, declarations: [IntegrationUpworkLayoutComponent,
            UpworkComponent,
            UpworkAuthorizeComponent,
            TransactionsComponent,
            ContractsComponent,
            SyncDataSelectionComponent,
            ReportsComponent], imports: [NbActionsModule,
            NbButtonModule,
            NbCalendarKitModule,
            NbCardModule,
            NbCheckboxModule,
            NbContextMenuModule,
            NbDatepickerModule,
            NbIconModule,
            NbInputModule,
            NbRouteTabsetModule,
            NbTabsetModule,
            NbToggleModule,
            NbTooltipModule, i1.RouterModule, i2.TranslateModule, SmartDataViewLayoutModule,
            SelectorsModule,
            SharedModule,
            TableComponentsModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationUpworkUiModule, providers: [
            {
                provide: ROUTES,
                useFactory: getUpworkRoutes,
                multi: true
            }
        ], imports: [NB_MODULES, RouterModule.forChild([]),
            TranslateModule.forChild(),
            SmartDataViewLayoutModule,
            SelectorsModule,
            SharedModule,
            TableComponentsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationUpworkUiModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IntegrationUpworkLayoutComponent,
                        UpworkComponent,
                        UpworkAuthorizeComponent,
                        TransactionsComponent,
                        ContractsComponent,
                        SyncDataSelectionComponent,
                        ReportsComponent
                    ],
                    imports: [
                        ...NB_MODULES,
                        RouterModule.forChild([]),
                        TranslateModule.forChild(),
                        SmartDataViewLayoutModule,
                        SelectorsModule,
                        SharedModule,
                        TableComponentsModule
                    ],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: getUpworkRoutes,
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=integration-upwork-ui.module.js.map