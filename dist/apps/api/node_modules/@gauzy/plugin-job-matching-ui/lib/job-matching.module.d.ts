import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./components/job-matching/job-matching.component";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@ng-select/ng-select";
export declare class JobMatchingModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
    private static _hasAppliedRegistrations;
    private readonly _log;
    private readonly _integrationEntitySettingServiceStoreService;
    private readonly _navMenuBuilderService;
    private readonly _pageRouteRegistryService;
    private readonly _pluginDefinition;
    private readonly _destroy$;
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap(): void;
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy(): void;
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    private _applyDeclarativeRegistrations;
    /**
     * Subscribes to the job matching entity observable and dynamically
     * adds or removes the "Matching" nav menu item based on whether
     * job matching sync is active.
     */
    private _subscribeToJobMatchingEntity;
    /**
     * Adds the "Matching" nav menu item under the jobs section.
     */
    private _addNavMenuItem;
    /**
     * Removes the "Matching" nav menu item from the jobs section.
     */
    private _removeNavMenuItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobMatchingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JobMatchingModule, [typeof i1.JobMatchingComponent], [typeof i2.RouterModule, typeof i3.NebularModule, typeof i4.TranslateModule, typeof i5.NgSelectModule, typeof i3.SharedModule, typeof i3.DialogsModule], [typeof i2.RouterModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JobMatchingModule>;
}
