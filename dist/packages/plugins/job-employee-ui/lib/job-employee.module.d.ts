import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./components/job-employee/job-employee.component";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "@ngx-translate/core";
import * as i5 from "./components/job-search-status-editor/job-search-status-editor.component";
export declare class JobEmployeeModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
    private static _hasAppliedRegistrations;
    private readonly _log;
    private readonly _navMenuBuilderService;
    private readonly _pageRouteRegistryService;
    private readonly _pluginDefinition;
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap(): void;
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy(): void;
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    private _applyDeclarativeRegistrations;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobEmployeeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JobEmployeeModule, [typeof i1.JobEmployeeComponent], [typeof i2.RouterModule, typeof i3.NebularModule, typeof i4.TranslateModule, typeof i3.SharedModule, typeof i3.SmartDataViewLayoutModule, typeof i3.DynamicTabsModule, typeof i3.TableComponentsModule, typeof i3.RecordViewModule, typeof i5.JobSearchStatusEditorComponent], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JobEmployeeModule>;
}
