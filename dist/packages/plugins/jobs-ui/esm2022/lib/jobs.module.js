import { inject, NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { LoggerService, NavMenuBuilderService, PageRouteRegistryService } from '@gauzy/ui-core/core';
import { SharedModule } from '@gauzy/ui-core/shared';
import { JobLayoutComponent } from './components/job-layout/job-layout.component';
import { getJobsRoutes } from './job.routes';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export class JobsModule {
    constructor() {
        this._log = inject(LoggerService).withContext('JobsModule');
        this._navMenuBuilderService = inject(NavMenuBuilderService);
        this._pageRouteRegistryService = inject(PageRouteRegistryService);
        this._pluginDefinition = inject(PLUGIN_DEFINITION, { optional: true });
    }
    static { this._hasAppliedRegistrations = false; }
    // ─── Plugin Lifecycle ─────────────────────────────────────────
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap() {
        this._log.log('Plugin bootstrapped');
        this._applyDeclarativeRegistrations();
    }
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy() {
        this._log.log('Plugin destroyed');
        JobsModule._hasAppliedRegistrations = false;
    }
    // ─── Registration ─────────────────────────────────────────────
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    _applyDeclarativeRegistrations() {
        if (JobsModule._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            navBuilder: this._navMenuBuilderService,
            pageRouteRegistry: this._pageRouteRegistryService
        });
        JobsModule._hasAppliedRegistrations = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: JobsModule, declarations: [JobLayoutComponent], imports: [SharedModule, i1.RouterModule], exports: [RouterModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobsModule, providers: [
            {
                provide: ROUTES,
                useFactory: (_pageRouteRegistryService) => getJobsRoutes(_pageRouteRegistryService),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [SharedModule, RouterModule.forChild([]), RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [JobLayoutComponent],
                    imports: [SharedModule, RouterModule.forChild([])],
                    exports: [RouterModule],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (_pageRouteRegistryService) => getJobsRoutes(_pageRouteRegistryService),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=jobs.module.js.map