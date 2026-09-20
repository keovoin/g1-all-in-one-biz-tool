import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/common";
import * as i3 from "@ngx-translate/core";
let AllowScreenshotCaptureComponent = class AllowScreenshotCaptureComponent {
    constructor() {
        this.allowScreenshotCaptureChange = new EventEmitter();
        this._allowed$ = new BehaviorSubject(false);
        this._rowData = null;
    }
    ngOnInit() {
        this._allowed$.next(this.rowData.allowScreenshotCapture);
        this.allowScreenshotCaptureChange
            .pipe(tap((allowed) => this._allowed$.next(allowed)), untilDestroyed(this))
            .subscribe();
    }
    onCheckedChange(event) {
        this.allowScreenshotCaptureChange.emit(event);
    }
    get allowed() {
        return this._allowed$.getValue();
    }
    get allowed$() {
        return this._allowed$.asObservable();
    }
    set rowData(value) {
        if (value) {
            this._rowData = value;
        }
    }
    get rowData() {
        return this._rowData;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AllowScreenshotCaptureComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: AllowScreenshotCaptureComponent, isStandalone: false, selector: "gauzy-allow-screenshot-capture", inputs: { value: "value", rowData: "rowData" }, outputs: { allowScreenshotCaptureChange: "allowScreenshotCaptureChange" }, ngImport: i0, template: "<nb-toggle\n\tstatus=\"primary\"\n\t[checked]=\"allowed$ | async\"\n\t(checkedChange)=\"onCheckedChange($event)\"\n\t>{{\n\t\t((allowed$ | async) ? 'EMPLOYEES_PAGE.ENABLED' : 'EMPLOYEES_PAGE.DISABLED') | translate\n\t}}</nb-toggle\n>\n", styles: [":host ::ng-deep nb-toggle div.checked+span.text{color:var(--text-primary-color)}:host ::ng-deep nb-toggle div+span.text{color:var(--gauzy-text-color-2)}::ng-deep nb-toggle.status-primary .toggle:not(.checked){background-color:#7e7e8f;border-color:#7e7e8f}\n"], dependencies: [{ kind: "component", type: i1.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
AllowScreenshotCaptureComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], AllowScreenshotCaptureComponent);
export { AllowScreenshotCaptureComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AllowScreenshotCaptureComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-allow-screenshot-capture', standalone: false, template: "<nb-toggle\n\tstatus=\"primary\"\n\t[checked]=\"allowed$ | async\"\n\t(checkedChange)=\"onCheckedChange($event)\"\n\t>{{\n\t\t((allowed$ | async) ? 'EMPLOYEES_PAGE.ENABLED' : 'EMPLOYEES_PAGE.DISABLED') | translate\n\t}}</nb-toggle\n>\n", styles: [":host ::ng-deep nb-toggle div.checked+span.text{color:var(--text-primary-color)}:host ::ng-deep nb-toggle div+span.text{color:var(--gauzy-text-color-2)}::ng-deep nb-toggle.status-primary .toggle:not(.checked){background-color:#7e7e8f;border-color:#7e7e8f}\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], allowScreenshotCaptureChange: [{
                type: Output
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=allow-screenshot-capture.component.js.map