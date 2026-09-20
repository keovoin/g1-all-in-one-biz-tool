import { Injectable } from '@angular/core';
import { TranslateCompiler } from '@ngx-translate/core';
import * as i0 from "@angular/core";
/**
 * Custom compiler for translations.
 */
export class CustomCompiler extends TranslateCompiler {
    /**
     * Compiles a single translation value.
     *
     * @param value The translation string to compile.
     * @param lang The language for which the translation is being compiled.
     * @returns The compiled translation string.
     */
    compile(value, lang) {
        // Implement your custom compilation logic here.
        // For example, you might want to perform certain transformations on the translation string.
        return value;
    }
    /**
     * Compiles a set of translations.
     *
     * @param translations The translations to compile.
     * @param lang The language for which the translations are being compiled.
     * @returns The compiled translations.
     */
    compileTranslations(translations, lang) {
        // Implement your custom translation compilation logic here.
        // For example, you might want to perform certain transformations on the entire set of translations.
        return translations;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomCompiler, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomCompiler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomCompiler, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=custom-compiler.js.map