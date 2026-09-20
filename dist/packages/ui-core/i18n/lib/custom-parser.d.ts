import { TranslateParser } from '@ngx-translate/core';
import * as i0 from "@angular/core";
/**
 * Custom implementation of the TranslateParser.
 */
export declare class CustomParser extends TranslateParser {
    /**
     * Interpolates the given expression with the provided parameters.
     *
     * @param expr The expression to interpolate. It can be a string or a function.
     * @param params The parameters to be used in the interpolation.
     * @returns The interpolated string.
     */
    interpolate(expr: string | Function, params?: any): string;
    /**
     * Retrieves the value associated with the given key from the target object.
     *
     * @param target The target object to retrieve the value from.
     * @param key The key used to access the value.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    getValue(target: any, key: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomParser, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CustomParser>;
}
