import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class SeoService implements OnDestroy {
    private router;
    private readonly destroy$;
    private readonly dom;
    private readonly isBrowser;
    private linkCanonical;
    constructor(router: Router, document: any, platformId: any);
    ngOnDestroy(): void;
    createCanonicalTag(): void;
    trackCanonicalChanges(): void;
    private getCanonicalUrl;
    static ɵfac: i0.ɵɵFactoryDeclaration<SeoService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SeoService>;
}
