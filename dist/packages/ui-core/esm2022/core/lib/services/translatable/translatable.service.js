import { Injectable } from '@angular/core';
import { LanguagesEnum } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class TranslatableService {
    constructor(translateService) {
        this.translateService = translateService;
    }
    /**
     * Retrieves the translated properties of an ITranslatable object based on the current language.
     *
     * @param {ITranslatable<any>} translatable - The ITranslatable object to be translated.
     * @param {string[]} translateProps - An array of property names to be translated.
     * @return {any} The translated ITranslatable object.
     */
    getTranslated(translatable, translateProps) {
        if (!translatable || !Array.isArray(translatable.translations)) {
            console.warn('Invalid translatable object or translations property:', translatable);
            return translatable;
        }
        const currentLangCode = this.translateService.getCurrentLang() || LanguagesEnum.ENGLISH;
        const currentLangTranslation = translatable.translations.find((tr) => tr.languageCode == currentLangCode);
        translateProps.forEach((prop) => {
            if (currentLangTranslation) {
                translatable[prop] = currentLangTranslation[prop];
            }
            else {
                translatable[prop] = '(No Translation)';
            }
        });
        return translatable;
    }
    /**
     * Retrieves the translated value of a specific property from an ITranslatable object based on the current language.
     *
     * @param {ITranslatable<any>} translatable - The ITranslatable object to be translated.
     * @param {string} translateProperty - The name of the property to be translated.
     * @return {string} The translated value of the specified property.
     */
    getTranslatedProperty(translatable, translateProperty) {
        if (!translatable || !translateProperty) {
            console.warn('Invalid translatable object or translation property:', translatable, translateProperty);
            return null;
        }
        return this.getTranslated({ ...translatable }, [translateProperty])[translateProperty];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TranslatableService, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TranslatableService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TranslatableService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.TranslateService }] });
//# sourceMappingURL=translatable.service.js.map