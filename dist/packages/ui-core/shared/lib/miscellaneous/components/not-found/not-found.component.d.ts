import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class NotFoundComponent implements AfterViewInit {
    private readonly router;
    constructor(router: Router);
    /**
     * After view init
     */
    ngAfterViewInit(): void;
    /**
     * Redirect to home page
     */
    goToHome(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NotFoundComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NotFoundComponent, "ngx-not-found", never, {}, {}, never, never, false, never>;
}
