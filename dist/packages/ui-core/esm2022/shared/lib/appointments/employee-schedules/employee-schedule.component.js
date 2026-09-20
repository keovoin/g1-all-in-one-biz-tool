import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import timezone from 'moment-timezone';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
export class EmployeeScheduleComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
    }
    ngOnInit() {
        this.schedule.slots.forEach((slot) => {
            slot.startTime = timezone(slot.startTime).tz(this.schedule.timezone).format('LLLL');
            slot.endTime = timezone(slot.endTime).tz(this.schedule.timezone).format('LLLL');
        });
    }
    /**
     * Close dialog
     *
     * @param value
     */
    closeDialog(value) {
        this.dialogRef.close(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeScheduleComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeScheduleComponent, isStandalone: false, selector: "ga-employee-schedules", usesInheritance: true, ngImport: i0, template: "<nb-card>\n  <nb-card-header>\n    {{ 'EMPLOYEE_SCHEDULES_MODAL.EMPLOYEE' | translate }}:\n    {{ schedule.employeeName }}\n  </nb-card-header>\n  <nb-card-body>\n    {{\n    (!schedule.slots.length\n    ? 'EMPLOYEE_SCHEDULES_MODAL.SLOTS_UNAVAILABLE'\n    : 'EMPLOYEE_SCHEDULES_MODAL.SLOTS_AVAILABLE'\n    ) | translate\n    }}\n    <div>\n      @if (schedule.slots.length) {\n        <nb-list>\n          @for (item of schedule.slots; track item) {\n            <nb-list-item>\n              <span>- {{ item.startTime }} to {{ item.endTime }} <br /></span>\n            </nb-list-item>\n          }\n        </nb-list>\n      }\n    </div>\n  </nb-card-body>\n  <nb-card-footer>\n    @if (!schedule.slots.length) {\n      <button nbButton type=\"button\" class=\"mr-3\" (click)=\"closeDialog('ok')\">\n        {{ 'BUTTONS.OK' | translate }}\n      </button>\n    }\n\n    @if (schedule.slots.length) {\n      <button nbButton type=\"button\" class=\"mr-3\" (click)=\"closeDialog('no')\">\n        {{ 'BUTTONS.NO' | translate }}\n      </button>\n      <button nbButton type=\"button\" status=\"success\" (click)=\"closeDialog('yes')\">\n        {{ 'BUTTONS.YES' | translate }}\n      </button>\n    }\n  </nb-card-footer>\n</nb-card>\n", dependencies: [{ kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeScheduleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-schedules', standalone: false, template: "<nb-card>\n  <nb-card-header>\n    {{ 'EMPLOYEE_SCHEDULES_MODAL.EMPLOYEE' | translate }}:\n    {{ schedule.employeeName }}\n  </nb-card-header>\n  <nb-card-body>\n    {{\n    (!schedule.slots.length\n    ? 'EMPLOYEE_SCHEDULES_MODAL.SLOTS_UNAVAILABLE'\n    : 'EMPLOYEE_SCHEDULES_MODAL.SLOTS_AVAILABLE'\n    ) | translate\n    }}\n    <div>\n      @if (schedule.slots.length) {\n        <nb-list>\n          @for (item of schedule.slots; track item) {\n            <nb-list-item>\n              <span>- {{ item.startTime }} to {{ item.endTime }} <br /></span>\n            </nb-list-item>\n          }\n        </nb-list>\n      }\n    </div>\n  </nb-card-body>\n  <nb-card-footer>\n    @if (!schedule.slots.length) {\n      <button nbButton type=\"button\" class=\"mr-3\" (click)=\"closeDialog('ok')\">\n        {{ 'BUTTONS.OK' | translate }}\n      </button>\n    }\n\n    @if (schedule.slots.length) {\n      <button nbButton type=\"button\" class=\"mr-3\" (click)=\"closeDialog('no')\">\n        {{ 'BUTTONS.NO' | translate }}\n      </button>\n      <button nbButton type=\"button\" status=\"success\" (click)=\"closeDialog('yes')\">\n        {{ 'BUTTONS.YES' | translate }}\n      </button>\n    }\n  </nb-card-footer>\n</nb-card>\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }] });
//# sourceMappingURL=employee-schedule.component.js.map