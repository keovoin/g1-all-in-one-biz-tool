import { Component, Output, EventEmitter } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@angular/forms";
export class DangerZoneMutationComponent extends TranslationBaseComponent {
    constructor(translate, dialogRef, toastrService) {
        super(translate);
        this.translate = translate;
        this.dialogRef = dialogRef;
        this.toastrService = toastrService;
        this.emitData = new EventEmitter();
    }
    close() {
        this.dialogRef.close();
    }
    sendData() {
        this.emitData.emit(this.data);
    }
    delete() {
        if (this.data === this.recordType) {
            this.dialogRef.close('ok');
        }
        else {
            this.toastrService.danger('NOTES.DANGER_ZONE.WRONG_INPUT_DATA');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DangerZoneMutationComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DangerZoneMutationComponent, isStandalone: false, selector: "ga-danger-zone-mutation", outputs: { emitData: "emitData" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"center\">\n\t<nb-card-header>\n\t\t<h6>{{ 'FORM.CONFIRM' | translate }}</h6>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<span>\n\t\t\t{{ title }}\n\t\t\t<br />\n\t\t\t{{ 'NOTES.DANGER_ZONE.RECORD_TYPE' | translate : { type: recordType } }}\n\t\t</span>\n\t\t<br /><br />\n\t\t<input [(ngModel)]=\"data\" (input)=\"sendData()\" type=\"text\" class=\"form-control border border-danger\" />\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"delete()\" class=\"mr-3\" status=\"danger\" nbButton>\n\t\t\t{{ 'BUTTONS.OK' | translate }}\n\t\t</button>\n\t\t<button (click)=\"close()\" status=\"info\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["span{color:red}nb-card{border:1px solid red}nb-card-body{text-align:center}.center{align-items:center;width:500px}\n"], dependencies: [{ kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DangerZoneMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-danger-zone-mutation', standalone: false, template: "<nb-card class=\"center\">\n\t<nb-card-header>\n\t\t<h6>{{ 'FORM.CONFIRM' | translate }}</h6>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<span>\n\t\t\t{{ title }}\n\t\t\t<br />\n\t\t\t{{ 'NOTES.DANGER_ZONE.RECORD_TYPE' | translate : { type: recordType } }}\n\t\t</span>\n\t\t<br /><br />\n\t\t<input [(ngModel)]=\"data\" (input)=\"sendData()\" type=\"text\" class=\"form-control border border-danger\" />\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"delete()\" class=\"mr-3\" status=\"danger\" nbButton>\n\t\t\t{{ 'BUTTONS.OK' | translate }}\n\t\t</button>\n\t\t<button (click)=\"close()\" status=\"info\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["span{color:red}nb-card{border:1px solid red}nb-card-body{text-align:center}.center{align-items:center;width:500px}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.ToastrService }], propDecorators: { emitData: [{
                type: Output
            }] } });
//# sourceMappingURL=danger-zone-mutation.component.js.map