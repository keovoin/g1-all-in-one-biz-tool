import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./integration-ever-async.layout.component";
import * as i2 from "./components/ever-async-connect/ever-async-connect.component";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@angular/router";
import * as i6 from "@ngx-translate/core";
import * as i7 from "@nebular/theme";
export declare class IntegrationEverAsyncUiModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
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
    static ɵfac: i0.ɵɵFactoryDeclaration<IntegrationEverAsyncUiModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IntegrationEverAsyncUiModule, [typeof i1.IntegrationEverAsyncLayoutComponent, typeof i2.EverAsyncConnectComponent], [typeof i3.CommonModule, typeof i4.ReactiveFormsModule, typeof i5.RouterModule, typeof i6.TranslateModule, typeof i7.NbButtonModule, typeof i7.NbCardModule, typeof i7.NbIconModule, typeof i7.NbInputModule, typeof i7.NbTooltipModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IntegrationEverAsyncUiModule>;
}
