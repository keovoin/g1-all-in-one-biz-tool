import { inject, NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { FileUploadModule } from 'ng2-file-upload';
import { Subject, of } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { PermissionsEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { IntegrationEntitySettingServiceStoreService, LoggerService, NavMenuBuilderService, PageRouteRegistryService } from '@gauzy/ui-core/core';
import { SmartDataViewLayoutModule, DialogsModule, NebularModule, ProposalTemplateSelectModule, RichTextEditorModule, SelectorsModule, SharedModule, StatusBadgeModule } from '@gauzy/ui-core/shared';
import { getJobSearchRoutes, JOB_SEARCH_PAGE_LINK } from './job-search.routes';
import { JobSearchComponent } from './components/job-search/job-search.component';
import { COMPONENTS } from './components';
import * as i0 from "@angular/core";
import * as i1 from "./components/apply-job-manually/apply-job-manually.component";
import * as i2 from "./components/job-title-description-details/job-title-description-details.component";
import * as i3 from "./components/job-status/job-status.component";
import * as i4 from "@angular/router";
import * as i5 from "@ngx-translate/core";
export class JobSearchModule {
    constructor() {
        this._log = inject(LoggerService).withContext('JobSearchModule');
        this._integrationEntitySettingServiceStoreService = inject(IntegrationEntitySettingServiceStoreService);
        this._navMenuBuilderService = inject(NavMenuBuilderService);
        this._pageRouteRegistryService = inject(PageRouteRegistryService);
        this._pluginDefinition = inject(PLUGIN_DEFINITION, { optional: true });
        this._destroy$ = new Subject();
    }
    static { this._hasAppliedRegistrations = false; }
    // ─── Plugin Lifecycle ─────────────────────────────────────────
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap() {
        this._log.log('Plugin bootstrapped');
        this._applyDeclarativeRegistrations();
        this._subscribeToJobMatchingEntity();
    }
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy() {
        this._log.log('Plugin destroyed');
        JobSearchModule._hasAppliedRegistrations = false;
        // Unsubscribe from all subscriptions
        this._destroy$.next();
        this._destroy$.complete();
    }
    // ─── Registration ─────────────────────────────────────────────
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    _applyDeclarativeRegistrations() {
        if (JobSearchModule._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            navBuilder: this._navMenuBuilderService,
            pageRouteRegistry: this._pageRouteRegistryService
        });
        JobSearchModule._hasAppliedRegistrations = true;
    }
    // ─── Job Matching Entity Subscription ─────────────────────────
    /**
     * Subscribes to the job matching entity observable and dynamically
     * adds or removes the "Browse" nav menu item based on whether
     * job matching sync is active.
     */
    _subscribeToJobMatchingEntity() {
        this._integrationEntitySettingServiceStoreService.jobMatchingEntity$
            .pipe(catchError((error) => {
            this._log.error('Error in job matching entity subscription', error);
            return of({ currentValue: { sync: false, isActive: false } });
        }), map(({ currentValue }) => !!currentValue?.sync && !!currentValue?.isActive), distinctUntilChange(), takeUntil(this._destroy$), tap((isActive) => (isActive ? this._addNavMenuItem() : this._removeNavMenuItem())))
            .subscribe();
    }
    /**
     * Adds the "Browse" nav menu item under the jobs section.
     */
    _addNavMenuItem() {
        this._navMenuBuilderService.addNavMenuItem({
            id: 'jobs-browse', // Unique identifier for the menu item
            title: 'Browse', // The title of the menu item
            icon: 'fas fa-list', // The icon class for the menu item, using FontAwesome in this case
            link: JOB_SEARCH_PAGE_LINK, // The link where the menu item directs
            data: {
                translationKey: 'MENU.JOBS_SEARCH', // The translation key for the menu item title
                permissionKeys: [PermissionsEnum.ORG_JOB_SEARCH] // The permission keys required to access the menu item
            }
        }, 'jobs', 'jobs-proposal-template');
    }
    /**
     * Removes the "Browse" nav menu item from the jobs section.
     */
    _removeNavMenuItem() {
        this._navMenuBuilderService.removeNavMenuItem('jobs-browse', 'jobs');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: JobSearchModule, declarations: [JobSearchComponent, i1.ApplyJobManuallyComponent, i2.JobTitleDescriptionDetailsComponent, i3.JobStatusComponent], imports: [i4.RouterModule, NebularModule,
            FileUploadModule,
            MomentModule, i5.TranslateModule, SmartDataViewLayoutModule,
            DialogsModule,
            ProposalTemplateSelectModule,
            RichTextEditorModule,
            SelectorsModule,
            SharedModule,
            StatusBadgeModule], exports: [RouterModule, i1.ApplyJobManuallyComponent, i2.JobTitleDescriptionDetailsComponent, i3.JobStatusComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchModule, providers: [
            {
                provide: ROUTES,
                useFactory: getJobSearchRoutes,
                multi: true
            }
        ], imports: [RouterModule.forChild([]),
            NebularModule,
            FileUploadModule,
            MomentModule,
            TranslateModule.forChild(),
            SmartDataViewLayoutModule,
            DialogsModule,
            ProposalTemplateSelectModule,
            RichTextEditorModule,
            SelectorsModule,
            SharedModule,
            StatusBadgeModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [JobSearchComponent, ...COMPONENTS],
                    imports: [
                        RouterModule.forChild([]),
                        NebularModule,
                        FileUploadModule,
                        MomentModule,
                        TranslateModule.forChild(),
                        SmartDataViewLayoutModule,
                        DialogsModule,
                        ProposalTemplateSelectModule,
                        RichTextEditorModule,
                        SelectorsModule,
                        SharedModule,
                        StatusBadgeModule
                    ],
                    exports: [RouterModule, ...COMPONENTS],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: getJobSearchRoutes,
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=job-search.module.js.map