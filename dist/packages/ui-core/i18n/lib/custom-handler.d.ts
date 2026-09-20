import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import * as i0 from "@angular/core";
/**
 * Custom handler for missing translations.
 */
export declare class CustomHandler implements MissingTranslationHandler {
    /**
     * Handles missing translations.
     *
     * @param params The parameters containing information about the missing translation.
     * @returns The fallback translation or a default message indicating the translation is missing.
     */
    handle(params: MissingTranslationHandlerParams): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomHandler, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CustomHandler>;
}
