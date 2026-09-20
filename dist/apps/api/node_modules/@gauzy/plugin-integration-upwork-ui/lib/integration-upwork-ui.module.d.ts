import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./integration-upwork.layout.component";
import * as i2 from "./components/upwork/upwork.component";
import * as i3 from "./components/upwork-authorize/upwork-authorize.component";
import * as i4 from "./components/transactions/transactions.component";
import * as i5 from "./components/contracts/contracts.component";
import * as i6 from "./components/sync-data-selection/sync-data-selection.component";
import * as i7 from "./components/reports/reports.component";
import * as i8 from "@nebular/theme";
import * as i9 from "@angular/router";
import * as i10 from "@ngx-translate/core";
import * as i11 from "@gauzy/ui-core/shared";
export declare class IntegrationUpworkUiModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
    private _hasAppliedRegistrations;
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
    static ɵfac: i0.ɵɵFactoryDeclaration<IntegrationUpworkUiModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IntegrationUpworkUiModule, [typeof i1.IntegrationUpworkLayoutComponent, typeof i2.UpworkComponent, typeof i3.UpworkAuthorizeComponent, typeof i4.TransactionsComponent, typeof i5.ContractsComponent, typeof i6.SyncDataSelectionComponent, typeof i7.ReportsComponent], [typeof i8.NbActionsModule, typeof i8.NbButtonModule, typeof i8.NbCalendarKitModule, typeof i8.NbCardModule, typeof i8.NbCheckboxModule, typeof i8.NbContextMenuModule, typeof i8.NbDatepickerModule, typeof i8.NbIconModule, typeof i8.NbInputModule, typeof i8.NbRouteTabsetModule, typeof i8.NbTabsetModule, typeof i8.NbToggleModule, typeof i8.NbTooltipModule, typeof i9.RouterModule, typeof i10.TranslateModule, typeof i11.SmartDataViewLayoutModule, typeof i11.SelectorsModule, typeof i11.SharedModule, typeof i11.TableComponentsModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IntegrationUpworkUiModule>;
}
