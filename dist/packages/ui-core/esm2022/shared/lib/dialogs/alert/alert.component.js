import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class AlertComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ngOnInit() { }
    /**
     * Closes the dialog.
     *
     * @return {void} No return value.
     */
    closeDialog() {
        this.dialogRef.close();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AlertComponent, deps: [{ token: i1.NbDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: AlertComponent, isStandalone: false, selector: "ngx-alert", inputs: { data: "data" }, ngImport: i0, template: "<nb-card class=\"view-log-dialog\">\n\t<nb-card-header>\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col\">\n\t\t\t\t{{ data?.title || ('DIALOG.ALERT' | translate) }}\n\t\t\t</div>\n\t\t\t<button nbButton ghost type=\"button\" class=\"col-auto\" (click)=\"closeDialog()\">\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"custom-scroll\">\n\t\t{{ data?.message }}\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button class=\"mr-2\" nbButton status=\"primary\" (click)=\"closeDialog()\">\n\t\t\t{{ data?.closeText || ('BUTTONS.OK' | translate) }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: [""], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AlertComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-alert', standalone: false, template: "<nb-card class=\"view-log-dialog\">\n\t<nb-card-header>\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col\">\n\t\t\t\t{{ data?.title || ('DIALOG.ALERT' | translate) }}\n\t\t\t</div>\n\t\t\t<button nbButton ghost type=\"button\" class=\"col-auto\" (click)=\"closeDialog()\">\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"custom-scroll\">\n\t\t{{ data?.message }}\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button class=\"mr-2\" nbButton status=\"primary\" (click)=\"closeDialog()\">\n\t\t\t{{ data?.closeText || ('BUTTONS.OK' | translate) }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n" }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }], propDecorators: { data: [{
                type: Input
            }] } });
//# sourceMappingURL=alert.component.js.map