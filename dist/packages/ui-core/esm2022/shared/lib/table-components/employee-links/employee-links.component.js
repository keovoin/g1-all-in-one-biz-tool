import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../directives/img.directive";
export class EmployeeLinksComponent {
    constructor(_router) {
        this._router = _router;
        this.isNavigation = true;
    }
    /**
     * Navigates to the employee edit page if the necessary conditions are met.
     */
    navigateToEmployee() {
        // Check if either 'value' or 'isNavigation' is falsy
        if (!this.value || !this.isNavigation) {
            // If any condition is not met, return without navigating
            return;
        }
        // Navigate to the employee edit page with the ID from 'this.value.id'
        this._router.navigate([`/pages/employees/edit`, this.value.id]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLinksComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeLinksComponent, isStandalone: false, selector: "ngx-employee-links", inputs: { rowData: "rowData", value: "value", isNavigation: "isNavigation" }, ngImport: i0, template: `
		@if (value) { @if (value?.name) {
		<a (click)="navigateToEmployee()" [class.link-text]="isNavigation">
			@if (value.imageUrl) {
			<img width="18px" height="18px" [src]="value.imageUrl" />
			}
			<div class="names-wrapper">
				{{ value.name }}
			</div>
		</a>
		} }
	`, isInline: true, styles: [":host a{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a{padding:5px 7px 5px 14px}[dir=ltr] :host a{padding:5px 14px 5px 7px}:host a{display:flex;flex-direction:row;align-items:center;width:fit-content;color:var(--text-primary-color)}:host a .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px;font-size:12px;font-weight:400;line-height:15px;letter-spacing:0em}:host a img{border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a img{margin-left:8px}[dir=ltr] :host a img{margin-right:8px}:host{width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".link-text{cursor:pointer;text-decoration:none}.link-text:hover{text-decoration:underline}\n"], dependencies: [{ kind: "directive", type: i2.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLinksComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-employee-links', template: `
		@if (value) { @if (value?.name) {
		<a (click)="navigateToEmployee()" [class.link-text]="isNavigation">
			@if (value.imageUrl) {
			<img width="18px" height="18px" [src]="value.imageUrl" />
			}
			<div class="names-wrapper">
				{{ value.name }}
			</div>
		</a>
		} }
	`, standalone: false, styles: [":host a{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a{padding:5px 7px 5px 14px}[dir=ltr] :host a{padding:5px 14px 5px 7px}:host a{display:flex;flex-direction:row;align-items:center;width:fit-content;color:var(--text-primary-color)}:host a .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px;font-size:12px;font-weight:400;line-height:15px;letter-spacing:0em}:host a img{border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a img{margin-left:8px}[dir=ltr] :host a img{margin-right:8px}:host{width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".link-text{cursor:pointer;text-decoration:none}.link-text:hover{text-decoration:underline}\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }], isNavigation: [{
                type: Input
            }] } });
//# sourceMappingURL=employee-links.component.js.map