import { OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ProposalLayoutComponent implements OnDestroy {
    readonly _translateService: TranslateService;
    readonly _ngxPermissionsService: NgxPermissionsService;
    readonly _store: Store;
    readonly _i18nService: I18nService;
    constructor(_translateService: TranslateService, _ngxPermissionsService: NgxPermissionsService, _store: Store, _i18nService: I18nService);
    /**
     * Initialize UI permissions
     */
    private initializeUiPermissions;
    /**
     * Initialize UI languages and Update Locale
     */
    private initializeUiLanguagesAndLocale;
    /**
     * Unsubscribe from all subscriptions
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalLayoutComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalLayoutComponent, "gz-proposal-layout", never, {}, {}, never, never, false, never>;
}
