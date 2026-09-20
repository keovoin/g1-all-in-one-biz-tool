import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Custom loader for the translation files.
 */
export declare class CustomTranslateLoader implements TranslateLoader {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Get translation from the server.
     * @param lang - The language code.
     * @returns An Observable that resolves to the translation object.
     */
    getTranslation(lang: string): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomTranslateLoader, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CustomTranslateLoader>;
}
