import { inject, NgModule } from '@angular/core';
import { ROUTES, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { PermissionsEnum } from '@gauzy/contracts';
import { LoggerService, NavMenuBuilderService, PageRouteRegistryService, Store } from '@gauzy/ui-core/core';
import { SmartDataViewLayoutModule, DialogsModule, EmployeeMultiSelectModule, NebularModule, RecordViewModule, RichTextEditorModule, SharedModule, StatusBadgeModule } from '@gauzy/ui-core/shared';
import { getJobProposalTemplateRoutes, JOB_PROPOSAL_TEMPLATE_PAGE_LINK } from './job-proposal-template.routes';
import { ProposalTemplateListComponent } from './components/proposal-template-list/proposal-template-list.component';
import { ProposalTemplateFormComponent } from './components/proposal-template-form/proposal-template-form.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
export class JobProposalTemplateModule {
    constructor() {
        this._log = inject(LoggerService).withContext('JobProposalTemplateModule');
        this._navMenuBuilderService = inject(NavMenuBuilderService);
        this._pageRouteRegistryService = inject(PageRouteRegistryService);
        this._store = inject(Store);
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
        JobProposalTemplateModule._hasAppliedRegistrations = false;
    }
    // ─── Registration ─────────────────────────────────────────────
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    _applyDeclarativeRegistrations() {
        if (JobProposalTemplateModule._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            pageRouteRegistry: this._pageRouteRegistryService
        });
        this._navMenuBuilderService.addNavMenuItem({
            id: 'jobs-proposal-template',
            title: 'Proposal Template',
            icon: 'far fa-file-alt',
            link: JOB_PROPOSAL_TEMPLATE_PAGE_LINK,
            data: {
                translationKey: 'MENU.PROPOSAL_TEMPLATE',
                permissionKeys: [PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW],
                ...(this._store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT) && {
                    add: '/pages/jobs/proposal-template?openAddDialog=true'
                })
            }
        }, 'jobs');
        JobProposalTemplateModule._hasAppliedRegistrations = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobProposalTemplateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: JobProposalTemplateModule, declarations: [ProposalTemplateListComponent, ProposalTemplateFormComponent], imports: [i1.RouterModule, NebularModule,
            RichTextEditorModule, i2.TranslateModule, SharedModule,
            SmartDataViewLayoutModule,
            StatusBadgeModule,
            EmployeeMultiSelectModule,
            DialogsModule,
            RecordViewModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobProposalTemplateModule, providers: [
            {
                provide: ROUTES,
                useFactory: getJobProposalTemplateRoutes,
                multi: true
            }
        ], imports: [RouterModule.forChild([]),
            NebularModule,
            RichTextEditorModule,
            TranslateModule.forChild(),
            SharedModule,
            SmartDataViewLayoutModule,
            StatusBadgeModule,
            EmployeeMultiSelectModule,
            DialogsModule,
            RecordViewModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobProposalTemplateModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ProposalTemplateListComponent, ProposalTemplateFormComponent],
                    imports: [
                        RouterModule.forChild([]),
                        NebularModule,
                        RichTextEditorModule,
                        TranslateModule.forChild(),
                        SharedModule,
                        SmartDataViewLayoutModule,
                        StatusBadgeModule,
                        EmployeeMultiSelectModule,
                        DialogsModule,
                        RecordViewModule
                    ],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: getJobProposalTemplateRoutes,
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=job-proposal-template.module.js.map