import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./components/proposal-layout.component";
import * as i2 from "./components/proposal/proposal.component";
import * as i3 from "./components/proposal-register/proposal-register.component";
import * as i4 from "./components/proposal-details/proposal-details.component";
import * as i5 from "./components/proposal-edit/proposal-edit.component";
import * as i6 from "./components/table-components/proposal-status/proposal-status.component";
import * as i7 from "./components/table-components/job-title/job-title.component";
import * as i8 from "@angular/router";
import * as i9 from "@gauzy/ui-core/shared";
import * as i10 from "@ng-select/ng-select";
import * as i11 from "@ngx-translate/core";
import * as i12 from "ng2-charts";
export declare class JobProposalModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
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
    /** Applies routes from the plugin definition. Guarded to run once per app lifecycle. */
    private _applyDeclarativeRegistrations;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobProposalModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JobProposalModule, [typeof i1.ProposalLayoutComponent, typeof i2.ProposalComponent, typeof i3.ProposalRegisterComponent, typeof i4.ProposalDetailsComponent, typeof i5.ProposalEditComponent, typeof i6.ProposalStatusComponent, typeof i7.JobTitleComponent], [typeof i8.RouterModule, typeof i9.RichTextEditorModule, typeof i10.NgSelectModule, typeof i11.TranslateModule, typeof i9.NebularModule, typeof i12.BaseChartDirective, typeof i9.SharedModule, typeof i9.TagsColorInputModule, typeof i9.TableComponentsModule, typeof i9.UserFormsModule, typeof i9.CardGridModule, typeof i9.ProposalTemplateSelectModule, typeof i9.SmartDataViewLayoutModule, typeof i9.ContactSelectModule, typeof i9.TableFiltersModule, typeof i9.SelectorsModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JobProposalModule>;
}
