import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./components/job-layout/job-layout.component";
import * as i2 from "@gauzy/ui-core/shared";
import * as i3 from "@angular/router";
export declare class JobsModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
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
    static ɵfac: i0.ɵɵFactoryDeclaration<JobsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JobsModule, [typeof i1.JobLayoutComponent], [typeof i2.SharedModule, typeof i3.RouterModule], [typeof i3.RouterModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JobsModule>;
}
