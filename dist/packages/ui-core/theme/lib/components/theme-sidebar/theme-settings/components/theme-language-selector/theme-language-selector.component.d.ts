import { OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ILanguage, IUser, LanguagesEnum } from '@gauzy/contracts';
import { LanguagesService, UsersService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import { ThemeLanguageSelectorService } from './theme-language-selector.service';
import * as i0 from "@angular/core";
export declare class ThemeLanguageSelectorComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly _store;
    private readonly _userService;
    private readonly _languagesService;
    private readonly _cdr;
    private readonly _selectorService;
    private readonly _i18nService;
    user: IUser;
    languages: ILanguage[];
    /**
     * Get preferred language
     */
    get preferredLanguage(): LanguagesEnum;
    /**
     * Set preferred language
     */
    set preferredLanguage(value: LanguagesEnum);
    constructor(_store: Store, _userService: UsersService, _languagesService: LanguagesService, _cdr: ChangeDetectorRef, _selectorService: ThemeLanguageSelectorService, _i18nService: I18nService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Load languages
     */
    private _loadLanguages;
    /**
     * Get system languages
     *
     * @param systemLanguages
     */
    getSystemLanguages(systemLanguages: ILanguage[]): void;
    /**
     * Switch language
     */
    switchLanguage(): void;
    /**
     * Currently selected language (drives the flag + name shown in the closed trigger)
     */
    get selectedLanguage(): ILanguage;
    /**
     * Flag asset URL for a language code (null when no flag is vendored)
     */
    getFlagUrl(code: string): string | null;
    /**
     * Hides a flag image that failed to load, leaving the plain language name
     */
    onFlagError(event: Event): void;
    /**
     * Updates the user's preferred language.
     *
     * @param input - User update payload containing preferred language information.
     */
    private changePreferredLanguage;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeLanguageSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ThemeLanguageSelectorComponent, "ngx-theme-language-selector", never, {}, {}, never, never, false, never>;
}
