import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, tap } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/common";
import * as i3 from "@ngx-translate/core";
let VisibilityComponent = class VisibilityComponent {
    constructor() {
        this.visibilityChange = new EventEmitter();
        this._visibility$ = new BehaviorSubject(false);
    }
    ngOnInit() {
        this._visibility$.next(this.rowData.public);
        this.visibilityChange
            .pipe(tap((isPublic) => this._visibility$.next(isPublic)), untilDestroyed(this))
            .subscribe();
    }
    onCheckedChange(event) {
        this.visibilityChange.emit(event);
    }
    get visibility$() {
        return this._visibility$.asObservable();
    }
    set rowData(value) {
        if (value) {
            this._rowData = value;
        }
    }
    get rowData() {
        return this._rowData;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VisibilityComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: VisibilityComponent, isStandalone: false, selector: "gauzy-visibility", inputs: { value: "value", rowData: "rowData" }, outputs: { visibilityChange: "visibilityChange" }, ngImport: i0, template: "<nb-toggle\n\tstatus=\"primary\"\n\t[checked]=\"visibility$ | async\"\n\t(checkedChange)=\"onCheckedChange($event)\"\n\t>{{\n\t\t((visibility$ | async) ? 'BUTTONS.PRIVATE' : 'BUTTONS.PUBLIC') | translate\n\t}}</nb-toggle\n>\n", styles: [":host ::ng-deep nb-toggle div.checked+span.text{color:var(--text-primary-color)}:host ::ng-deep nb-toggle div+span.text{color:var(--gauzy-text-color-2, var(--text-hint-color))}::ng-deep nb-toggle.status-primary .toggle:not(.checked){background-color:#7e7e8f;border-color:#7e7e8f}\n"], dependencies: [{ kind: "component", type: i1.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
VisibilityComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], VisibilityComponent);
export { VisibilityComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VisibilityComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-visibility', standalone: false, template: "<nb-toggle\n\tstatus=\"primary\"\n\t[checked]=\"visibility$ | async\"\n\t(checkedChange)=\"onCheckedChange($event)\"\n\t>{{\n\t\t((visibility$ | async) ? 'BUTTONS.PRIVATE' : 'BUTTONS.PUBLIC') | translate\n\t}}</nb-toggle\n>\n", styles: [":host ::ng-deep nb-toggle div.checked+span.text{color:var(--text-primary-color)}:host ::ng-deep nb-toggle div+span.text{color:var(--gauzy-text-color-2, var(--text-hint-color))}::ng-deep nb-toggle.status-primary .toggle:not(.checked){background-color:#7e7e8f;border-color:#7e7e8f}\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], visibilityChange: [{
                type: Output
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=visibility.component.js.map