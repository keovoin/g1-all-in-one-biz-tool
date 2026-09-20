import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
export class NotFoundComponent {
    constructor(router) {
        this.router = router;
    }
    /**
     * After view init
     */
    ngAfterViewInit() {
        setTimeout(() => this.goToHome(), 3000);
    }
    /**
     * Redirect to home page
     */
    goToHome() {
        this.router.navigate(['/pages/dashboard']);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NotFoundComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: NotFoundComponent, isStandalone: false, selector: "ngx-not-found", ngImport: i0, template: "<div class=\"row\">\n\t<div class=\"col-md-12\">\n\t\t<nb-card>\n\t\t\t<nb-card-body>\n\t\t\t\t<div class=\"flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12\">\n\t\t\t\t\t<h2 class=\"not-found-num\">404</h2>\n\t\t\t\t\t<h3 class=\"title\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.404_PAGE_NOT_FOUND' | translate }}\n\t\t\t\t\t</h3>\n\t\t\t\t\t<small class=\"sub-title\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.THE_PAGE_YOU_WERE_LOOKING_FOR_DOES_NOT_EXIST' | translate }}\n\t\t\t\t\t</small>\n\t\t\t\t\t<p class=\"redirect-home-title\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.REDIRECT_TO_HOME' | translate }}\n\t\t\t\t\t</p>\n\t\t\t\t\t<button (click)=\"goToHome()\" type=\"button\" class=\"btn btn-block btn-hero-primary\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.TAKE_ME_HOME' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\t</div>\n</div>\n", styles: [".flex-centered{max-width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;flex-grow:1}::ng-deep ngx-not-found{height:100%}.row{height:100%}nb-card{height:100%;background-color:transparent}nb-card-body{display:flex;margin:auto;width:70%;height:70%;background-color:var(--card-background-color);flex-grow:0;flex-basis:auto;flex-shrink:1;border-radius:var(--border-radius)}.not-found-num{text-align:center;font-size:8rem;margin:3rem 0}.title{text-align:center}.sub-title{text-align:center;display:block;margin-bottom:3rem;color:var(--color-basic-600);font-weight:700}.redirect-home-title{color:var(--color-basic-600);font-weight:700;margin-bottom:0}.btn{margin-bottom:2rem;color:var(--color-primary-500);font-weight:700}\n"], dependencies: [{ kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NotFoundComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-not-found', standalone: false, template: "<div class=\"row\">\n\t<div class=\"col-md-12\">\n\t\t<nb-card>\n\t\t\t<nb-card-body>\n\t\t\t\t<div class=\"flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12\">\n\t\t\t\t\t<h2 class=\"not-found-num\">404</h2>\n\t\t\t\t\t<h3 class=\"title\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.404_PAGE_NOT_FOUND' | translate }}\n\t\t\t\t\t</h3>\n\t\t\t\t\t<small class=\"sub-title\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.THE_PAGE_YOU_WERE_LOOKING_FOR_DOES_NOT_EXIST' | translate }}\n\t\t\t\t\t</small>\n\t\t\t\t\t<p class=\"redirect-home-title\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.REDIRECT_TO_HOME' | translate }}\n\t\t\t\t\t</p>\n\t\t\t\t\t<button (click)=\"goToHome()\" type=\"button\" class=\"btn btn-block btn-hero-primary\">\n\t\t\t\t\t\t{{ 'PAGE_NOT_FOUND.TAKE_ME_HOME' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\t</div>\n</div>\n", styles: [".flex-centered{max-width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;flex-grow:1}::ng-deep ngx-not-found{height:100%}.row{height:100%}nb-card{height:100%;background-color:transparent}nb-card-body{display:flex;margin:auto;width:70%;height:70%;background-color:var(--card-background-color);flex-grow:0;flex-basis:auto;flex-shrink:1;border-radius:var(--border-radius)}.not-found-num{text-align:center;font-size:8rem;margin:3rem 0}.title{text-align:center}.sub-title{text-align:center;display:block;margin-bottom:3rem;color:var(--color-basic-600);font-weight:700}.redirect-home-title{color:var(--color-basic-600);font-weight:700;margin-bottom:0}.btn{margin-bottom:2rem;color:var(--color-primary-500);font-weight:700}\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }] });
//# sourceMappingURL=not-found.component.js.map