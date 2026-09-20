import { OnInit, WritableSignal } from '@angular/core';
import { NbMenuItem, NbRouteTab } from '@nebular/theme';
import { ID, IOrganization } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class UpworkComponent extends TranslationBaseComponent implements OnInit {
    private readonly _router;
    private readonly _activatedRoute;
    private readonly _upworkStore;
    private readonly _store;
    protected tabs: WritableSignal<NbRouteTab[]>;
    protected menus: WritableSignal<NbMenuItem[]>;
    protected integrationId: WritableSignal<ID | undefined>;
    protected organization: WritableSignal<IOrganization | undefined>;
    constructor();
    ngOnInit(): void;
    /**
     * Loads the Upwork integration's non-secret configuration state into the store.
     *
     * The tenant is no longer sent: the API takes it from the authenticated request context, so a
     * client can neither name another tenant nor learn anything about one (GHSA-3rqg-gpm9-gx84).
     */
    private _getConfig;
    /**
     *
     * @param tabName
     * @returns
     */
    getRoute(tabName: string): string;
    /**
     *
     */
    private _loadTabs;
    /**
     *
     */
    private _loadMenus;
    private _applyTranslationOnTabsActions;
    /**
     * Navigate to the "Integrations" page.
     */
    navigateToIntegrations(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UpworkComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UpworkComponent, "ngx-upwork", never, {}, {}, never, never, false, never>;
}
