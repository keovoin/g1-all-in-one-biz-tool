import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ROUTES } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { LoggerService, NavMenuBuilderService, PageRouteRegistryService } from '@gauzy/ui-core/core';
import { EverAsyncConnectComponent } from './components/ever-async-connect/ever-async-connect.component';
import { IntegrationEverAsyncLayoutComponent } from './integration-ever-async.layout.component';
import { getEverAsyncRoutes } from './integration-ever-async.routes';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
export class IntegrationEverAsyncUiModule {
    constructor() {
        this._hasAppliedRegistrations = false;
        this._log = inject(LoggerService).withContext('IntegrationEverAsyncUiModule');
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
        // Page routes live for the registry's lifetime, including across dynamic
        // module reloads. Reuse this plugin's identical route; other collisions
        // still reach the registry's normal duplicate-registration error.
        const routes = this._pluginDefinition.routes?.filter((route) => route.location !== 'integrations-sections' ||
            !this._pageRouteRegistryService
                .getPageLocationRoutes('integrations-sections')
                .some((existing) => existing.path === route.path && existing.loadChildren === route.loadChildren));
        applyDeclarativeRegistrations({ ...this._pluginDefinition, routes }, {
            navBuilder: this._navMenuBuilderService,
            pageRouteRegistry: this._pageRouteRegistryService
        });
        this._hasAppliedRegistrations = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEverAsyncUiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEverAsyncUiModule, declarations: [IntegrationEverAsyncLayoutComponent, EverAsyncConnectComponent], imports: [CommonModule,
            ReactiveFormsModule, i1.RouterModule, i2.TranslateModule, NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbTooltipModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEverAsyncUiModule, providers: [
            {
                provide: ROUTES,
                useFactory: getEverAsyncRoutes,
                multi: true
            }
        ], imports: [CommonModule,
            ReactiveFormsModule,
            RouterModule.forChild([]),
            TranslateModule.forChild(),
            NbButtonModule,
            NbCardModule,
            NbIconModule,
            NbInputModule,
            NbTooltipModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEverAsyncUiModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IntegrationEverAsyncLayoutComponent, EverAsyncConnectComponent],
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        RouterModule.forChild([]),
                        TranslateModule.forChild(),
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbTooltipModule
                    ],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: getEverAsyncRoutes,
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=integration-ever-async-ui.module.js.map