import { inject, NgModule } from '@angular/core';
import { ROUTES, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION } from '@gauzy/plugin-ui';
import { FeatureEnum, PermissionsEnum } from '@gauzy/contracts';
import { LoggerService, NavMenuBuilderService, PageRouteRegistryService, Store } from '@gauzy/ui-core/core';
import { SmartDataViewLayoutModule, SharedModule, SelectorsModule, TableFiltersModule, ContactSelectModule, ProposalTemplateSelectModule, CardGridModule, RichTextEditorModule, UserFormsModule, TableComponentsModule, TagsColorInputModule, NebularModule } from '@gauzy/ui-core/shared';
import { getProposalsRoutes, JOB_PROPOSAL_PAGE_LINK } from './job-proposal.routes';
import { COMPONENTS } from './components';
import * as i0 from "@angular/core";
import * as i1 from "./components/proposal-layout.component";
import * as i2 from "./components/proposal/proposal.component";
import * as i3 from "./components/proposal-register/proposal-register.component";
import * as i4 from "./components/proposal-details/proposal-details.component";
import * as i5 from "./components/proposal-edit/proposal-edit.component";
import * as i6 from "./components/table-components/proposal-status/proposal-status.component";
import * as i7 from "./components/table-components/job-title/job-title.component";
import * as i8 from "@angular/router";
import * as i9 from "@ngx-translate/core";
export class JobProposalModule {
    constructor() {
        this._log = inject(LoggerService).withContext('JobProposalModule');
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
        JobProposalModule._hasAppliedRegistrations = false;
    }
    // ─── Registration ─────────────────────────────────────────────
    /** Applies routes from the plugin definition. Guarded to run once per app lifecycle. */
    _applyDeclarativeRegistrations() {
        if (JobProposalModule._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            pageRouteRegistry: this._pageRouteRegistryService
        });
        this._navMenuBuilderService.addNavMenuItem({
            id: 'sales-proposals',
            title: 'Proposals',
            icon: 'fas fa-paper-plane',
            link: JOB_PROPOSAL_PAGE_LINK,
            data: {
                translationKey: 'MENU.PROPOSALS',
                permissionKeys: [PermissionsEnum.ORG_PROPOSALS_VIEW],
                featureKey: FeatureEnum.FEATURE_PROPOSAL,
                ...(this._store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT, PermissionsEnum.ORG_PROPOSALS_EDIT) && {
                    add: '/pages/sales/proposals/register'
                })
            }
        }, 'sales', 'sales-estimates');
        JobProposalModule._hasAppliedRegistrations = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobProposalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: JobProposalModule, declarations: [i1.ProposalLayoutComponent, i2.ProposalComponent, i3.ProposalRegisterComponent, i4.ProposalDetailsComponent, i5.ProposalEditComponent, i6.ProposalStatusComponent, i7.JobTitleComponent], imports: [i8.RouterModule, RichTextEditorModule,
            NgSelectModule, i9.TranslateModule, NebularModule,
            BaseChartDirective,
            SharedModule,
            TagsColorInputModule,
            TableComponentsModule,
            UserFormsModule,
            CardGridModule,
            ProposalTemplateSelectModule,
            SmartDataViewLayoutModule,
            ContactSelectModule,
            TableFiltersModule,
            SelectorsModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobProposalModule, providers: [
            {
                provide: ROUTES,
                useFactory: (registry) => getProposalsRoutes(registry),
                deps: [PageRouteRegistryService],
                multi: true
            }
        ], imports: [RouterModule.forChild([]),
            RichTextEditorModule,
            NgSelectModule,
            TranslateModule.forChild(),
            NebularModule,
            SharedModule,
            TagsColorInputModule,
            TableComponentsModule,
            UserFormsModule,
            CardGridModule,
            ProposalTemplateSelectModule,
            SmartDataViewLayoutModule,
            ContactSelectModule,
            TableFiltersModule,
            SelectorsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobProposalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        RouterModule.forChild([]),
                        RichTextEditorModule,
                        NgSelectModule,
                        TranslateModule.forChild(),
                        NebularModule,
                        BaseChartDirective,
                        SharedModule,
                        TagsColorInputModule,
                        TableComponentsModule,
                        UserFormsModule,
                        CardGridModule,
                        ProposalTemplateSelectModule,
                        SmartDataViewLayoutModule,
                        ContactSelectModule,
                        TableFiltersModule,
                        SelectorsModule
                    ],
                    declarations: [...COMPONENTS],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (registry) => getProposalsRoutes(registry),
                            deps: [PageRouteRegistryService],
                            multi: true
                        }
                    ]
                }]
        }] });
//# sourceMappingURL=job-proposal.module.js.map