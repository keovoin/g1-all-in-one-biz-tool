import { __decorate, __metadata } from "tslib";
import { Component, inject, ChangeDetectionStrategy, signal, Input } from '@angular/core';
import { of } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { tap, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorHandlingService, ToastrService, UpworkStoreService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/shared";
import * as i3 from "@angular/forms";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@angular/common";
let SyncDataSelectionComponent = class SyncDataSelectionComponent extends TranslationBaseComponent {
    /** exposes the current contracts value and allows context injection */
    set contracts(value) {
        // always update the signal so we don't keep stale data
        // an empty array or null means nothing selected
        this.contractsSignal.set(value ?? []);
    }
    get contracts() {
        return this.contractsSignal();
    }
    constructor() {
        super(inject(TranslateService));
        this._us = inject(UpworkStoreService);
        this.toastrService = inject(ToastrService);
        this.dialogRef = inject((NbDialogRef));
        this.errorHandlingService = inject(ErrorHandlingService);
        this.contractsSettings$ = this._us.contractsSettings$;
        this.contractsSignal = signal([], ...(ngDevMode ? [{ debugName: "contractsSignal" }] : []));
    }
    syncData() {
        this._us
            .syncDataWithContractRelated(this.contracts)
            .pipe(tap(() => {
            this.toastrService.success(this.getTranslation('INTEGRATIONS.UPWORK_PAGE.CONTRACTS_RELATED_DATA'));
            this.dialogRef.close();
        }), catchError((err) => {
            this.errorHandlingService.handleError(err);
            return of(null);
        }), untilDestroyed(this))
            .subscribe();
    }
    setSelectedEmployee(employee) {
        if (employee) {
            this._us.setSelectedEmployeeId(employee.id);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SyncDataSelectionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SyncDataSelectionComponent, isStandalone: false, selector: "ngx-sync-data-selection", inputs: { contracts: "contracts" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"sync-data-selection\">\n\t<nb-card-header>\n\t\t{{ 'INTEGRATIONS.SETTINGS' | translate }}\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t@if (contractsSettings$ | async; as contractsSettings) {\n\t\t\t<div class=\"switcher-wrapper\">\n\t\t\t\t@for (entity of contractsSettings.entitiesToSync; track entity) {\n\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t[(checked)]=\"entity.sync\"\n\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t[disabled]=\"contractsSettings.onlyContracts\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ entity.name }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t@if (entity.datePicker) {\n\t\t\t\t\t\t<div class=\"datepicker\">\n\t\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t[showAllEmployeesOption]=\"false\"\n\t\t\t\t\t\t\t\t(selectionChanged)=\"setSelectedEmployee($event)\"\n\t\t\t\t\t\t\t\tclass=\"employee-selector\"\n\t\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t\t\t<div class=\"datepicker-wrapper\">\n\t\t\t\t\t\t\t\t<label for=\"dueDate\" class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ 'INTEGRATIONS.UPWORK_PAGE.SELECT_DATE' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'INTEGRATIONS.UPWORK_PAGE.SELECT_DATE' | translate }}\"\n\t\t\t\t\t\t\t\t\t[nbDatepicker]=\"taskDueDatePicker\"\n\t\t\t\t\t\t\t\t\t[(ngModel)]=\"entity.datePicker.selectedDate\"\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t[disabled]=\"contractsSettings.onlyContracts\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t<nb-datepicker #taskDueDatePicker [max]=\"entity.datePicker.max\"></nb-datepicker>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t<nb-checkbox class=\"only-contracts\" [(checked)]=\"contractsSettings.onlyContracts\"\n\t\t\t\t\t><strong> {{ 'INTEGRATIONS.UPWORK_PAGE.ONLY_CONTRACTS' | translate }}</strong></nb-checkbox\n\t\t\t\t>\n\t\t\t</div>\n\t\t}\n\t</nb-card-body>\n\n\t<nb-card-footer>\n\t\t<div class=\"dialog-footer\">\n\t\t\t<button nbButton (click)=\"syncData()\" status=\"primary\" class=\"mr-2\">\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>{{ 'BUTTONS.SYNC' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".datepicker{margin-bottom:15px;display:flex}.employee-selector{align-self:flex-end;margin-right:20px;flex:1}.only-contracts{align-self:flex-end}.datepicker-wrapper{width:30%}.switcher-wrapper{display:flex;flex-direction:column}.switcher-wrapper nb-toggle{display:flex}.switcher-wrapper nb-toggle ::ng-deep .toggle-label{display:flex;justify-content:space-between;flex-grow:1}.dialog-footer{display:flex;justify-content:flex-end}.tied-entities-wrapper{padding-left:15px}.visible{height:50px;transition:.2s all ease-in-out}.not-visible{transition:.2s all ease-in-out;height:0px;visibility:hidden}.tied-entity{display:flex;align-items:center;justify-content:space-between}.entity-more-options{display:flex;align-items:center;margin-left:-20px}.entity-more-options .label{margin:0 5px 0 0}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i1.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "component", type: i2.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
SyncDataSelectionComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], SyncDataSelectionComponent);
export { SyncDataSelectionComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SyncDataSelectionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-sync-data-selection', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<nb-card class=\"sync-data-selection\">\n\t<nb-card-header>\n\t\t{{ 'INTEGRATIONS.SETTINGS' | translate }}\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t@if (contractsSettings$ | async; as contractsSettings) {\n\t\t\t<div class=\"switcher-wrapper\">\n\t\t\t\t@for (entity of contractsSettings.entitiesToSync; track entity) {\n\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t[(checked)]=\"entity.sync\"\n\t\t\t\t\t\tlabelPosition=\"start\"\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t[disabled]=\"contractsSettings.onlyContracts\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ entity.name }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t@if (entity.datePicker) {\n\t\t\t\t\t\t<div class=\"datepicker\">\n\t\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t[showAllEmployeesOption]=\"false\"\n\t\t\t\t\t\t\t\t(selectionChanged)=\"setSelectedEmployee($event)\"\n\t\t\t\t\t\t\t\tclass=\"employee-selector\"\n\t\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t\t\t<div class=\"datepicker-wrapper\">\n\t\t\t\t\t\t\t\t<label for=\"dueDate\" class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ 'INTEGRATIONS.UPWORK_PAGE.SELECT_DATE' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tplaceholder=\"{{ 'INTEGRATIONS.UPWORK_PAGE.SELECT_DATE' | translate }}\"\n\t\t\t\t\t\t\t\t\t[nbDatepicker]=\"taskDueDatePicker\"\n\t\t\t\t\t\t\t\t\t[(ngModel)]=\"entity.datePicker.selectedDate\"\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\t[disabled]=\"contractsSettings.onlyContracts\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t<nb-datepicker #taskDueDatePicker [max]=\"entity.datePicker.max\"></nb-datepicker>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t<nb-checkbox class=\"only-contracts\" [(checked)]=\"contractsSettings.onlyContracts\"\n\t\t\t\t\t><strong> {{ 'INTEGRATIONS.UPWORK_PAGE.ONLY_CONTRACTS' | translate }}</strong></nb-checkbox\n\t\t\t\t>\n\t\t\t</div>\n\t\t}\n\t</nb-card-body>\n\n\t<nb-card-footer>\n\t\t<div class=\"dialog-footer\">\n\t\t\t<button nbButton (click)=\"syncData()\" status=\"primary\" class=\"mr-2\">\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"edit-outline\"></nb-icon>{{ 'BUTTONS.SYNC' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-footer>\n</nb-card>\n", styles: [".datepicker{margin-bottom:15px;display:flex}.employee-selector{align-self:flex-end;margin-right:20px;flex:1}.only-contracts{align-self:flex-end}.datepicker-wrapper{width:30%}.switcher-wrapper{display:flex;flex-direction:column}.switcher-wrapper nb-toggle{display:flex}.switcher-wrapper nb-toggle ::ng-deep .toggle-label{display:flex;justify-content:space-between;flex-grow:1}.dialog-footer{display:flex;justify-content:flex-end}.tied-entities-wrapper{padding-left:15px}.visible{height:50px;transition:.2s all ease-in-out}.not-visible{transition:.2s all ease-in-out;height:0px;visibility:hidden}.tied-entity{display:flex;align-items:center;justify-content:space-between}.entity-more-options{display:flex;align-items:center;margin-left:-20px}.entity-more-options .label{margin:0 5px 0 0}\n"] }]
        }], ctorParameters: () => [], propDecorators: { contracts: [{
                type: Input
            }] } });
//# sourceMappingURL=sync-data-selection.component.js.map