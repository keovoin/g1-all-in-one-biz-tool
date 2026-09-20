import { Component, Input } from '@angular/core';
import { Cell, DefaultEditor } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/img.directive";
export class EmployeeLinkEditorComponent extends DefaultEditor {
    ngOnInit() {
        const employee = this.cell.getRow().getData();
        this.value = employee?.user ?? null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLinkEditorComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeLinkEditorComponent, isStandalone: false, selector: "ng-component", inputs: { cell: "cell" }, usesInheritance: true, ngImport: i0, template: `
		@if (value) {
		  @if (value?.name) {
		    <a>
		      @if (value.imageUrl) {
		        <img width="18px" height="18px" [src]="value.imageUrl" />
		      }
		      <div class="names-wrapper">
		        {{ value.name }}
		      </div>
		    </a>
		  }
		}
		`, isInline: true, styles: [":host a{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a{padding:5px 7px 5px 14px}[dir=ltr] :host a{padding:5px 14px 5px 7px}:host a{display:flex;flex-direction:row;align-items:center;width:fit-content;color:var(--text-primary-color)}:host a .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px;font-size:12px;font-weight:400;line-height:15px;letter-spacing:0em}:host a img{border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a img{margin-left:8px}[dir=ltr] :host a img{margin-right:8px}:host{width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeLinkEditorComponent, decorators: [{
            type: Component,
            args: [{ template: `
		@if (value) {
		  @if (value?.name) {
		    <a>
		      @if (value.imageUrl) {
		        <img width="18px" height="18px" [src]="value.imageUrl" />
		      }
		      <div class="names-wrapper">
		        {{ value.name }}
		      </div>
		    </a>
		  }
		}
		`, standalone: false, styles: [":host a{background-color:var(--color-primary-transparent-100);border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a{padding:5px 7px 5px 14px}[dir=ltr] :host a{padding:5px 14px 5px 7px}:host a{display:flex;flex-direction:row;align-items:center;width:fit-content;color:var(--text-primary-color)}:host a .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px;font-size:12px;font-weight:400;line-height:15px;letter-spacing:0em}:host a img{border-radius:var(--button-rectangle-border-radius)}[dir=rtl] :host a img{margin-left:8px}[dir=ltr] :host a img{margin-right:8px}:host{width:100%}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { cell: [{
                type: Input
            }] } });
//# sourceMappingURL=employee-link-editor.component.js.map