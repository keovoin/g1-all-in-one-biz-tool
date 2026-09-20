import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./components/job-search/job-search.component";
import * as i2 from "./components/apply-job-manually/apply-job-manually.component";
import * as i3 from "./components/job-title-description-details/job-title-description-details.component";
import * as i4 from "./components/job-status/job-status.component";
import * as i5 from "@angular/router";
import * as i6 from "@gauzy/ui-core/shared";
import * as i7 from "ng2-file-upload";
import * as i8 from "ngx-moment";
import * as i9 from "@ngx-translate/core";
export declare class JobSearchModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
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
     * adds or removes the "Browse" nav menu item based on whether
     * job matching sync is active.
     */
    private _subscribeToJobMatchingEntity;
    /**
     * Adds the "Browse" nav menu item under the jobs section.
     */
    private _addNavMenuItem;
    /**
     * Removes the "Browse" nav menu item from the jobs section.
     */
    private _removeNavMenuItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobSearchModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JobSearchModule, [typeof i1.JobSearchComponent, typeof i2.ApplyJobManuallyComponent, typeof i3.JobTitleDescriptionDetailsComponent, typeof i4.JobStatusComponent], [typeof i5.RouterModule, typeof i6.NebularModule, typeof i7.FileUploadModule, typeof i8.MomentModule, typeof i9.TranslateModule, typeof i6.SmartDataViewLayoutModule, typeof i6.DialogsModule, typeof i6.ProposalTemplateSelectModule, typeof i6.RichTextEditorModule, typeof i6.SelectorsModule, typeof i6.SharedModule, typeof i6.StatusBadgeModule], [typeof i5.RouterModule, typeof i2.ApplyJobManuallyComponent, typeof i3.JobTitleDescriptionDetailsComponent, typeof i4.JobStatusComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JobSearchModule>;
}
