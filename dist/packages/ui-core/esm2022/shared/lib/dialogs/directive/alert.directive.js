import { __decorate } from "tslib";
// tslint:disable: variable-name
import { Directive, Input, Output, HostListener, EventEmitter, inject } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertComponent } from '../alert/alert.component';
import * as i0 from "@angular/core";
let AlertDirective = class AlertDirective {
    constructor() {
        this.data = {};
        this.close = new EventEmitter();
        this.dialogService = inject(NbDialogService);
    }
    set message(value) {
        this.data.message = value;
    }
    set title(value) {
        this.data.title = value;
    }
    set closeText(value) {
        this.data.closeText = value;
    }
    /**
     * Handles the click event and opens an alert dialog.
     *
     * @param {Event} $event - The click event object.
     * @return {void} This function does not return anything.
     */
    onClick($event) {
        $event.stopPropagation();
        const dialogRef = this.dialogService.open(AlertComponent, {
            dialogClass: 'modal-sm',
            context: {
                data: this.data
            }
        });
        dialogRef.onClose.pipe(untilDestroyed(this)).subscribe((result) => {
            this.close.emit();
        });
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AlertDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: AlertDirective, isStandalone: true, selector: "[ngxAlertDialog]", inputs: { message: "message", title: "title", closeText: "closeText" }, outputs: { close: "close" }, host: { listeners: { "click": "onClick($event)" } }, ngImport: i0 }); }
};
AlertDirective = __decorate([
    UntilDestroy({ checkProperties: true })
], AlertDirective);
export { AlertDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AlertDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxAlertDialog]',
                    standalone: true
                }]
        }], propDecorators: { message: [{
                type: Input
            }], title: [{
                type: Input
            }], closeText: [{
                type: Input
            }], close: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=alert.directive.js.map