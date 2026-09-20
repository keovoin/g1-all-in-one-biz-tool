import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class AddIconComponent extends TranslationBaseComponent {
    constructor(dialogRef, translateService) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.translateService = translateService;
        this._ngDestroy$ = new Subject();
    }
    closeDialog() {
        this.dialogRef.close();
    }
    onIconset(icon) {
        this.dialogRef.close(icon);
    }
    ngOnDestroy() {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AddIconComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: AddIconComponent, isStandalone: false, selector: "ga-add-icon", usesInheritance: true, ngImport: i0, template: "<nb-card>\n\t<nb-card-body>\n\t\t<div class=\"header\">\n\t\t\t<p>{{ 'HELP_PAGE.CHOSE_ICON' | translate }}</p>\n\t\t\t<nb-icon\n\t\t\t\tclass=\"ml-1\"\n\t\t\t\ticon=\"close-outline\"\n\t\t\t\t(click)=\"closeDialog()\"\n\t\t\t></nb-icon>\n\t\t</div>\n\t\t<div class=\"add-icon-field\">\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('book-open-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"book-open-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('archive-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"archive-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('alert-circle-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"alert-circle-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('attach-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"attach-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: [".main-buttons{margin:10px;background-color:#36f!important;border-color:#36f!important;color:#fff!important}.main-buttons:focus{box-shadow:none!important;background-color:#36f!important;border-color:#36f!important;color:#fff!important}.header{display:flex;flex-direction:row}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AddIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-add-icon', standalone: false, template: "<nb-card>\n\t<nb-card-body>\n\t\t<div class=\"header\">\n\t\t\t<p>{{ 'HELP_PAGE.CHOSE_ICON' | translate }}</p>\n\t\t\t<nb-icon\n\t\t\t\tclass=\"ml-1\"\n\t\t\t\ticon=\"close-outline\"\n\t\t\t\t(click)=\"closeDialog()\"\n\t\t\t></nb-icon>\n\t\t</div>\n\t\t<div class=\"add-icon-field\">\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('book-open-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"book-open-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('archive-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"archive-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('alert-circle-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"alert-circle-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\tclass=\"main-buttons\"\n\t\t\t\t(click)=\"onIconset('attach-outline')\"\n\t\t\t\tnbButton\n\t\t\t>\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"attach-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: [".main-buttons{margin:10px;background-color:#36f!important;border-color:#36f!important;color:#fff!important}.main-buttons:focus{box-shadow:none!important;background-color:#36f!important;border-color:#36f!important;color:#fff!important}.header{display:flex;flex-direction:row}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TranslateService }] });
//# sourceMappingURL=add-icon.component.js.map