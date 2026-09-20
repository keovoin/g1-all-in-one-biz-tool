import { inject, NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { PermissionsEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { IntegrationEntitySettingServiceStoreService, LoggerService, NavMenuBuilderService, PageRouteRegistryService } from '@gauzy/ui-core/core';
import { DialogsModule, NebularModule, SharedModule } from '@gauzy/ui-core/shared';
import { getJobMatchingRoutes, JOB_MATCHING_PAGE_LINK } from './job-matching.routes';
import { JobMatchingComponent } from './components/job-matching/job-matching.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
export class JobMatchingModule {
    constructor() {
        this._log = inject(LoggerService).withContext('JobMatchingModule');
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
        JobMatchingModule._hasAppliedRegistrations = false;
        // Unsubscribe from all subscriptions
        this._destroy$.next();
        this._destroy$.complete();
    }
    // ─── Registration ─────────────────────────────────────────────
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    _applyDeclarativeRegistrations() {
        if (JobMatchingModule._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            navBuilder: this._navMenuBuilderService,
            pageRouteRegistry: this._pageRouteRegistryService
        });
        JobMatchingModule._hasAppliedRegistrations = true;
    }
    // ─── Job Matching Entity Subscription ─────────────────────────
    /**
     * Subscribes to the job matching entity observable and dynamically
     * adds or removes the "Matching" nav menu item based on whether
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
     * Adds the "Matching" nav menu item under the jobs section.
     */
    _addNavMenuItem() {
        this._navMenuBuilderService.addNavMenuItem({
            id: 'jobs-matching', // Unique identifier for the menu item
            title: 'Matching', // The title of the menu item
            icon: 'fas fa-user', // The icon class for the menu item, using FontAwesome in this case
            link: JOB_MATCHING_PAGE_LINK, // The link where the menu item directs
            data: {
                translationKey: 'MENU.JOBS_MATCHING', // The translation key for the menu item title
                permissionKeys: [PermissionsEnum.ORG_JOB_MATCHING_VIEW] // The permission keys required to access the menu item
            }
        }, 'jobs', 'jobs-proposal-template');
    }
    /**
     * Removes the "Matching" nav menu item from the jobs section.
     */
    _removeNavMenuItem() {
        this._navMenuBuilderService.removeNavMenuItem('jobs-matching', 'jobs');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobMatchingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: JobMatchingModule, declarations: [JobMatchingComponent], imports: [i1.RouterModule, NebularModule, i2.TranslateModule, NgSelectModule,
            SharedModule,
            DialogsModule], exports: [RouterModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobMatchingModule, providers: [
            {
                provide: ROUTES,
                useFactory: getJobMatchingRoutes,
                multi: true
            }
        ], imports: [RouterModule.forChild([]),
            NebularModule,
            TranslateModule.forChild(),
            NgSelectModule,
            SharedModule,
            DialogsModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobMatchingModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [JobMatchingComponent],
                    imports: [
                        RouterModule.forChild([]),
                        NebularModule,
                        TranslateModule.forChild(),
                        NgSelectModule,
                        SharedModule,
                        DialogsModule
                    ],
                    exports: [RouterModule],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: getJobMatchingRoutes,
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=job-matching.module.js.map