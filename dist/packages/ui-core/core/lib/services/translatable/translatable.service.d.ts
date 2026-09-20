import { ITranslatable } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import * as i0 from "@angular/core";
export declare class TranslatableService {
    private readonly translateService;
    constructor(translateService: TranslateService);
    /**
     * Retrieves the translated properties of an ITranslatable object based on the current language.
     *
     * @param {ITranslatable<any>} translatable - The ITranslatable object to be translated.
     * @param {string[]} translateProps - An array of property names to be translated.
     * @return {any} The translated ITranslatable object.
     */
    getTranslated(translatable: ITranslatable<any>, translateProps: string[]): any;
    /**
     * Retrieves the translated value of a specific property from an ITranslatable object based on the current language.
     *
     * @param {ITranslatable<any>} translatable - The ITranslatable object to be translated.
     * @param {string} translateProperty - The name of the property to be translated.
     * @return {string} The translated value of the specified property.
     */
    getTranslatedProperty(translatable: ITranslatable<any>, translateProperty: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TranslatableService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TranslatableService>;
}
