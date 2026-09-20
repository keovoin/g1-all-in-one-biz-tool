import { inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { LoggerService, NavMenuBuilderService, PageRouteRegistryService } from '@gauzy/ui-core/core';
import { DynamicTabsModule, NebularModule, RecordViewModule, SharedModule, SmartDataViewLayoutModule, TableComponentsModule } from '@gauzy/ui-core/shared';
import { JobEmployeeComponent } from './components/job-employee/job-employee.component';
import { JobSearchStatusEditorComponent } from './components/job-search-status-editor/job-search-status-editor.component';
import { JobSearchStoreService } from './providers/job-search-store.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
export class JobEmployeeModule {
    constructor() {
        this._log = inject(LoggerService).withContext('JobEmployeeModule');
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
        JobEmployeeModule._hasAppliedRegistrations = false;
    }
    // ─── Registration ─────────────────────────────────────────────
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    _applyDeclarativeRegistrations() {
        if (JobEmployeeModule._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            navBuilder: this._navMenuBuilderService,
            pageRouteRegistry: this._pageRouteRegistryService
        });
        JobEmployeeModule._hasAppliedRegistrations = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobEmployeeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: JobEmployeeModule, declarations: [JobEmployeeComponent], imports: [i1.RouterModule, NebularModule, i2.TranslateModule, SharedModule,
            SmartDataViewLayoutModule,
            DynamicTabsModule,
            TableComponentsModule,
            RecordViewModule,
            JobSearchStatusEditorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobEmployeeModule, providers: [JobSearchStoreService], imports: [RouterModule.forChild([]),
            NebularModule,
            TranslateModule.forChild(),
            SharedModule,
            SmartDataViewLayoutModule,
            DynamicTabsModule,
            TableComponentsModule,
            RecordViewModule,
            JobSearchStatusEditorComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobEmployeeModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [JobEmployeeComponent],
                    providers: [JobSearchStoreService],
                    imports: [
                        RouterModule.forChild([]),
                        NebularModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        SmartDataViewLayoutModule,
                        DynamicTabsModule,
                        TableComponentsModule,
                        RecordViewModule,
                        JobSearchStatusEditorComponent
                    ]
                }]
        }] });
//# sourceMappingURL=job-employee.module.js.map