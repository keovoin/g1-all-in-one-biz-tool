import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SafeUrlPipe implements PipeTransform {
    private readonly sanitizer;
    /**
     *
     * @param url should be a string
     * @returns is safe string
     */
    transform(url: string): import("@angular/platform-browser").SafeResourceUrl;
    static ɵfac: i0.ɵɵFactoryDeclaration<SafeUrlPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SafeUrlPipe, "safeUrl", true>;
}
