import { TranslateCompiler } from '@ngx-translate/core';
import * as i0 from "@angular/core";
/**
 * Custom compiler for translations.
 */
export declare class CustomCompiler extends TranslateCompiler {
    /**
     * Compiles a single translation value.
     *
     * @param value The translation string to compile.
     * @param lang The language for which the translation is being compiled.
     * @returns The compiled translation string.
     */
    compile(value: string, lang: string): string;
    /**
     * Compiles a set of translations.
     *
     * @param translations The translations to compile.
     * @param lang The language for which the translations are being compiled.
     * @returns The compiled translations.
     */
    compileTranslations(translations: any, lang: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomCompiler, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CustomCompiler>;
}
