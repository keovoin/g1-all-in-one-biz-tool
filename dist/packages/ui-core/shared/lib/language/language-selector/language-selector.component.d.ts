import { OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LanguagesService } from '@gauzy/ui-core/core';
import { ILanguage } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { NbComponentSize } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class LanguageSelectorComponent extends TranslationBaseComponent implements OnInit {
    private readonly languagesService;
    readonly translate: TranslateService;
    private readonly store;
    private cd;
    languages: ILanguage[];
    loading: boolean;
    onChange: any;
    onTouch: any;
    _placeholder: string;
    get placeholder(): string;
    set placeholder(value: string);
    _clearable: boolean;
    get clearable(): boolean;
    set clearable(value: boolean);
    _addTag: boolean;
    get addTag(): boolean;
    set addTag(value: boolean);
    _selectedLanguageCode: string;
    get selectedLanguageCode(): string;
    set selectedLanguageCode(value: string);
    selectBy: 'code' | 'object';
    labelForId: string;
    _template: string;
    get template(): string;
    set template(value: string);
    _size: NbComponentSize;
    get size(): NbComponentSize;
    set size(value: NbComponentSize);
    selectedLanguageEvent: EventEmitter<ILanguage>;
    constructor(languagesService: LanguagesService, translate: TranslateService, store: Store, cd: ChangeDetectorRef);
    onChangeLanguage(currentSelection: ILanguage): void;
    onSelectedChange(code: ILanguage['code']): void;
    writeValue(value: string): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    addLanguage: (languageName: string) => Promise<ILanguage>;
    ngOnInit(): Promise<void>;
    getAllLanguages(): Promise<void>;
    checkPreFilledLanguage(): void;
    getLanguageByCode(code: ILanguage['code']): ILanguage;
    /**
     * Currently selected language (drives the flag + name shown in the closed nb-select trigger).
     */
    get selectedLanguage(): ILanguage;
    /**
     * Flag asset URL for a language code (null when no flag is vendored).
     */
    getFlagUrl(code: ILanguage['code']): string | null;
    /**
     * Hides a flag image that failed to load, leaving the plain language name.
     */
    onFlagError(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LanguageSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LanguageSelectorComponent, "ngx-language-selector", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "clearable": { "alias": "clearable"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; "selectedLanguageCode": { "alias": "selectedLanguageCode"; "required": false; }; "selectBy": { "alias": "selectBy"; "required": false; }; "labelForId": { "alias": "labelForId"; "required": false; }; "template": { "alias": "template"; "required": false; }; "size": { "alias": "size"; "required": false; }; }, { "selectedLanguageEvent": "selectedLanguageEvent"; }, never, never, false, never>;
}
