import { __decorate } from "tslib";
import { Directive, Input, Output, HostListener, EventEmitter, inject } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmComponent } from '../confirm/confirm.component';
import * as i0 from "@angular/core";
let ConfirmDirective = class ConfirmDirective {
    constructor() {
        this.data = {};
        this.confirm = new EventEmitter();
        this.decline = new EventEmitter();
        this.dialogService = inject(NbDialogService);
    }
    set message(value) {
        this.data.message = value;
    }
    set title(value) {
        this.data.title = value;
    }
    set yesText(value) {
        this.data.yesText = value;
    }
    set noText(value) {
        this.data.noText = value;
    }
    /**
     * Handles the click event and opens a confirmation dialog.
     *
     * @param {Event} $event - The click event object.
     * @return {void} This function does not return anything.
     */
    onClick($event) {
        $event.stopPropagation();
        const dialogRef = this.dialogService.open(ConfirmComponent, {
            dialogClass: 'modal-sm',
            context: {
                data: this.data
            }
        });
        dialogRef.onClose.pipe(untilDestroyed(this)).subscribe((confirm) => {
            if (confirm) {
                this.confirm.emit();
            }
            else {
                this.decline.emit();
            }
        });
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ConfirmDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: ConfirmDirective, isStandalone: true, selector: "[ngxConfirmDialog]", inputs: { message: "message", title: "title", yesText: "yesText", noText: "noText" }, outputs: { confirm: "confirm", decline: "decline" }, host: { listeners: { "click": "onClick($event)" } }, ngImport: i0 }); }
};
ConfirmDirective = __decorate([
    UntilDestroy({ checkProperties: true })
], ConfirmDirective);
export { ConfirmDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ConfirmDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxConfirmDialog]',
                    standalone: true
                }]
        }], propDecorators: { message: [{
                type: Input
            }], title: [{
                type: Input
            }], yesText: [{
                type: Input
            }], noText: [{
                type: Input
            }], confirm: [{
                type: Output
            }], decline: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=confirm.directive.js.map