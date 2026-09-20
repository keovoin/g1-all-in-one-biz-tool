import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class SearchInputComponent {
    constructor() {
        this.isInputShown = false;
        this.search = new EventEmitter();
    }
    showInput() {
        this.isInputShown = true;
        this.input.nativeElement.focus();
    }
    hideInput() {
        this.isInputShown = false;
    }
    onInput(val) {
        this.search.emit(val);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SearchInputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: SearchInputComponent, isStandalone: false, selector: "ngx-search-input", outputs: { search: "search" }, viewQueries: [{ propertyName: "input", first: true, predicate: ["input"], descendants: true, static: true }], ngImport: i0, template: `
		<i class="control-icon ion ion-ios-search" (click)="showInput()"></i>
		<input
			#input
			[placeholder]="'FORM.PLACEHOLDERS.TYPE_SEARCH_REQUEST' | translate"
			[class.hidden]="!isInputShown"
			(blur)="hideInput()"
			(input)="onInput($event)"
		/>
	`, isInline: true, styles: [":host{display:flex;align-items:center}:host i.control-icon:before{font-size:2.3rem}:host i.control-icon:hover{cursor:pointer}:host input{border:none;outline:none;margin-left:1rem;width:15rem;transition:width .2s ease}:host input.hidden{width:0;margin:0}:host ::ng-deep search-input input{background:transparent}\n"], dependencies: [{ kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SearchInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-search-input', template: `
		<i class="control-icon ion ion-ios-search" (click)="showInput()"></i>
		<input
			#input
			[placeholder]="'FORM.PLACEHOLDERS.TYPE_SEARCH_REQUEST' | translate"
			[class.hidden]="!isInputShown"
			(blur)="hideInput()"
			(input)="onInput($event)"
		/>
	`, standalone: false, styles: [":host{display:flex;align-items:center}:host i.control-icon:before{font-size:2.3rem}:host i.control-icon:hover{cursor:pointer}:host input{border:none;outline:none;margin-left:1rem;width:15rem;transition:width .2s ease}:host input.hidden{width:0;margin:0}:host ::ng-deep search-input input{background:transparent}\n"] }]
        }], propDecorators: { input: [{
                type: ViewChild,
                args: ['input', { static: true }]
            }], search: [{
                type: Output
            }] } });
//# sourceMappingURL=search-input.component.js.map