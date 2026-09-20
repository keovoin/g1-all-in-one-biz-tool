import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./components/proposal-template-list/proposal-template-list.component";
import * as i2 from "./components/proposal-template-form/proposal-template-form.component";
import * as i3 from "@angular/router";
import * as i4 from "@gauzy/ui-core/shared";
import * as i5 from "@ngx-translate/core";
export declare class JobProposalTemplateModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
    private static _hasAppliedRegistrations;
    private readonly _log;
    private readonly _navMenuBuilderService;
    private readonly _pageRouteRegistryService;
    private readonly _store;
    private readonly _pluginDefinition;
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap(): void;
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy(): void;
    /** Applies routes and nav from the plugin definition. Guarded to run once per app lifecycle. */
    private _applyDeclarativeRegistrations;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobProposalTemplateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JobProposalTemplateModule, [typeof i1.ProposalTemplateListComponent, typeof i2.ProposalTemplateFormComponent], [typeof i3.RouterModule, typeof i4.NebularModule, typeof i4.RichTextEditorModule, typeof i5.TranslateModule, typeof i4.SharedModule, typeof i4.SmartDataViewLayoutModule, typeof i4.StatusBadgeModule, typeof i4.EmployeeMultiSelectModule, typeof i4.DialogsModule, typeof i4.RecordViewModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JobProposalTemplateModule>;
}
