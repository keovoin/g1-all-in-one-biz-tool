import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TasksService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@nebular/theme";
let TaskNumberFieldComponent = class TaskNumberFieldComponent extends TranslationBaseComponent {
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        this._projectId = value;
        this.number$.next(true);
    }
    set number(val) {
        this._number = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get number() {
        return this._number;
    }
    constructor(translateService, store, tasksService) {
        super(translateService);
        this.translateService = translateService;
        this.store = store;
        this.tasksService = tasksService;
        this.formControl = new FormControl();
        this.onChange = () => { };
        this.onTouched = () => { };
        this.number$ = new Subject();
    }
    ngOnInit() {
        this.number$
            .pipe(tap(() => this.getOneMaximumTaskNumber()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.number$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    writeValue(value) {
        this._number = value;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    async getOneMaximumTaskNumber() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        try {
            this.tasksService
                .getMaxTaskNumber({
                tenantId,
                organizationId,
                ...(this.projectId
                    ? {
                        projectId: this.projectId
                    }
                    : {})
            })
                .pipe(tap((maxNumber) => (this.number = maxNumber + 1)), untilDestroyed(this))
                .subscribe();
        }
        catch (error) {
            console.log('Error while getting max task number', error);
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskNumberFieldComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.TasksService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskNumberFieldComponent, isStandalone: false, selector: "ngx-task-number-field", inputs: { formControl: "formControl", placeholder: "placeholder", projectId: "projectId" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TaskNumberFieldComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "\n<div class=\"form-group\">\n    <label for=\"taskNumber\" class=\"label\">\n        <span>\n            {{ 'TASKS_PAGE.TASK_NUMBER' | translate }}\n        </span>\n    </label>\n    <input\n        [disabled]=\"formControl.disabled\"\n        type=\"number\"\n        [min]=\"0\"\n        nbInput\n        [placeholder]=\"placeholder || 'TASKS_PAGE.TASK_NUMBER' | translate\"\n        [id]=\"'taskNumber'\"\n        [(ngModel)]=\"number\"\n        fullWidth\n    />\n</div>", dependencies: [{ kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i4.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
TaskNumberFieldComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        TasksService])
], TaskNumberFieldComponent);
export { TaskNumberFieldComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskNumberFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-task-number-field', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TaskNumberFieldComponent),
                            multi: true
                        }
                    ], standalone: false, template: "\n<div class=\"form-group\">\n    <label for=\"taskNumber\" class=\"label\">\n        <span>\n            {{ 'TASKS_PAGE.TASK_NUMBER' | translate }}\n        </span>\n    </label>\n    <input\n        [disabled]=\"formControl.disabled\"\n        type=\"number\"\n        [min]=\"0\"\n        nbInput\n        [placeholder]=\"placeholder || 'TASKS_PAGE.TASK_NUMBER' | translate\"\n        [id]=\"'taskNumber'\"\n        [(ngModel)]=\"number\"\n        fullWidth\n    />\n</div>" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.TasksService }], propDecorators: { formControl: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], projectId: [{
                type: Input
            }] } });
//# sourceMappingURL=task-number-field.component.js.map