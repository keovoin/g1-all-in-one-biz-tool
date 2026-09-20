import { LanguagesEnum } from '@gauzy/contracts';
import { NbLayoutDirectionService } from '@nebular/theme';
import { ElectronService, Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ThemeLanguageSelectorService {
    private readonly _store;
    private readonly _electronService;
    private readonly _directionService;
    private readonly _i18nService;
    /**
     * Preferred language
     */
    private _preferredLanguage;
    get preferredLanguage(): LanguagesEnum;
    set preferredLanguage(value: LanguagesEnum);
    constructor(_store: Store, _electronService: ElectronService, _directionService: NbLayoutDirectionService, _i18nService: I18nService);
    initialize(): void;
    /**
     * Sets the application language and layout direction based on the preferred language.
     */
    setLanguage(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeLanguageSelectorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ThemeLanguageSelectorService>;
}
