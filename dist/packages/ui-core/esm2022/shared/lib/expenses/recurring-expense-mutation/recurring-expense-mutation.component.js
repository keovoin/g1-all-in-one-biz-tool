var RecurringExpenseMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, ViewChild, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { debounceTime, filter, firstValueFrom, tap } from 'rxjs';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DateRangePickerBuilderService, EmployeeRecurringExpenseService, EmployeesService, ErrorHandlingService, ExpenseCategoriesStoreService, OrganizationRecurringExpenseService, Store, ToastrService, defaultDateFormat } from '@gauzy/ui-core/core';
import { ComponentType, RecurringExpenseDefaultCategoriesEnum, StartDateUpdateTypeEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeeSelectorComponent } from '../../selectors/employee/employee.component';
import { DEFAULT_CATEGORIES } from './recurring-expense.setting';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@ng-select/ng-select";
import * as i6 from "../../selectors/employee/employee.component";
import * as i7 from "../../modules/currency/currency.component";
import * as i8 from "@angular/common";
let RecurringExpenseMutationComponent = class RecurringExpenseMutationComponent extends TranslationBaseComponent {
    static { RecurringExpenseMutationComponent_1 = this; }
    get recurringExpense() {
        return this._recurringExpense;
    }
    set recurringExpense(recurringExpense) {
        if (recurringExpense) {
            this._recurringExpense = recurringExpense;
            this._initializeForm(recurringExpense);
        }
    }
    static buildForm(fb, self) {
        const { startDate } = self.dateRangePickerBuilderService.selectedDateRange;
        return fb.group({
            categoryName: [null, Validators.required],
            value: [null, Validators.required],
            currency: [null, Validators.required],
            splitExpense: [false],
            startDate: [new Date(startDate.getFullYear(), startDate.getMonth(), 1)]
        });
    }
    constructor(fb, dialogRef, store, dateRangePickerBuilderService, employeesService, expenseCategoriesStore, translate, toastrService, errorHandler, organizationRecurringExpenseService, employeeRecurringExpenseService) {
        super(translate);
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.store = store;
        this.dateRangePickerBuilderService = dateRangePickerBuilderService;
        this.employeesService = employeesService;
        this.expenseCategoriesStore = expenseCategoriesStore;
        this.translate = translate;
        this.toastrService = toastrService;
        this.errorHandler = errorHandler;
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
        this.startDateUpdateType = StartDateUpdateTypeEnum.NO_CHANGE;
        this.startDateChangeLoading = false;
        this.defaultFilteredCategories = [];
        this.defaultCategories = DEFAULT_CATEGORIES;
        this.ComponentTypeEnum = ComponentType;
        this.conflicts = [];
        /*
         * Recurring Expense Mutation Form
         */
        this.form = RecurringExpenseMutationComponent_1.buildForm(this.fb, this);
        this.addNewCustomCategory = async (name) => {
            if (!this.organization || !name) {
                return;
            }
            try {
                const { id: organizationId } = this.organization;
                const { tenantId } = this.store.user;
                const createdCategory = await firstValueFrom(this.expenseCategoriesStore.create({
                    tenantId,
                    organizationId,
                    name
                }));
                this.toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_EXPENSE_CATEGORIES.ADD_EXPENSE_CATEGORY', {
                    name
                });
                return {
                    value: createdCategory.name,
                    label: createdCategory.name
                };
            }
            catch (error) {
                this.errorHandler.handleError(error);
            }
        };
    }
    get currencyValue() {
        return this.form.get('currency').value;
    }
    get currency() {
        return this.form.get('currency');
    }
    get startDate() {
        return this.form.get('startDate').value;
    }
    get value() {
        return this.form.get('value').value;
    }
    formatToOrganizationDate(date) {
        return date ? moment(date).format(this.store.selectedOrganization.dateFormat || defaultDateFormat) : 'end';
    }
    previousMonth(date) {
        return moment(date).subtract({ months: 1 }).format('MMM, YYYY');
    }
    month(date) {
        return moment(date).format('MMM, YYYY');
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(debounceTime(200), distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.getExpenseCategories()), untilDestroyed(this))
            .subscribe();
        this.defaultFilteredCategories = this.defaultCategories
            .filter((c) => c.types.indexOf(this.componentType) > -1)
            .map((i) => ({
            value: i.category,
            label: this.getTranslatedExpenseCategory(i.category)
        }));
        this.expenseCategoriesStore.expenseCategories$
            .pipe(filter((categories) => !!categories.length), tap((categories) => this.mappedExpenseCategories(categories)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() { }
    ngOnDestroy() { }
    /**
     * GET expense categories by organization
     *
     * @returns
     */
    getExpenseCategories() {
        if (!this.organization) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        this.expenseCategoriesStore.loadAll({
            organizationId,
            tenantId
        });
    }
    /**
     * Mapped Expense Categories
     *
     * @param categories
     */
    mappedExpenseCategories(categories) {
        const storedCategories = [];
        for (let category of categories) {
            storedCategories.push({
                value: category.name,
                label: category.name
            });
        }
        // Define a helper function to create a unique key based on label and name
        const getKey = (item) => `${item.label}-${item.value}`;
        // Merge the storedCategories with defaultFilteredCategories and filter out duplicates
        const mergedCategories = [...this.defaultFilteredCategories, ...storedCategories].reduce((uniqueItems, item) => {
            // Generate a unique key for the current item
            const key = getKey(item);
            // If the key is not already present in the set, add the item to the set and to the result array
            if (!uniqueItems.set.has(key)) {
                uniqueItems.set.add(key);
                uniqueItems.result.push(item);
            }
            return uniqueItems;
        }, { set: new Set(), result: [] }).result;
        // Now, map the mergedCategories as needed
        const uniqueFilteredCategories = mergedCategories.map((item) => {
            // Perform any additional mapping or transformation if required
            return item;
        });
        // Update the defaultFilteredCategories with the uniqueFilteredCategories
        this.defaultFilteredCategories = uniqueFilteredCategories;
    }
    submitForm() {
        if (this.form.valid) {
            this.closeAndSubmit();
        }
    }
    async closeAndSubmit() {
        if (!this.organization) {
            return;
        }
        const { id: organizationId } = this.organization;
        const { tenantId } = this.store.user;
        let employee;
        if (this.recurringExpense && this.recurringExpense.employeeId) {
            employee = await firstValueFrom(this.employeesService.getEmployeeById(this.recurringExpense.employeeId));
        }
        const { categoryName, startDate } = this.form.getRawValue();
        const payload = {
            ...this.form.getRawValue(),
            categoryName: categoryName,
            startDay: startDate.getDate(),
            startMonth: startDate.getMonth(),
            startYear: startDate.getFullYear(),
            organizationId,
            tenantId
        };
        if (this.recurringExpense && this.recurringExpense.employeeId) {
            payload['employee'] = employee;
        }
        else {
            payload['employee'] = this.employeeSelector ? this.employeeSelector.selectedEmployee : null;
        }
        this.dialogRef.close(payload);
    }
    getTranslatedExpenseCategory(categoryName) {
        return this.getTranslation(`EXPENSES_PAGE.DEFAULT_CATEGORY.${categoryName}`);
    }
    addCustomCategoryName(term) {
        return { value: term, label: term };
    }
    _initializeForm(recurringExpense) {
        const { startDate } = this.dateRangePickerBuilderService.selectedDateRange;
        this.form.patchValue({
            categoryName: recurringExpense ? recurringExpense.categoryName : '',
            value: recurringExpense ? recurringExpense.value : '',
            currency: recurringExpense ? recurringExpense.currency : '',
            splitExpense: recurringExpense && recurringExpense.splitExpense ? recurringExpense.splitExpense : false,
            startDate: recurringExpense && recurringExpense.startDate
                ? new Date(recurringExpense.startDate)
                : new Date(startDate.getFullYear(), startDate.getMonth(), 1)
        });
        if (recurringExpense && !(recurringExpense.categoryName in RecurringExpenseDefaultCategoriesEnum)) {
            this.defaultFilteredCategories = [
                {
                    value: recurringExpense.categoryName,
                    label: recurringExpense.categoryName
                },
                ...this.defaultFilteredCategories
            ];
            console.log(this.defaultFilteredCategories);
        }
    }
    async datePickerChanged(newValue) {
        this.startDateChangeLoading = true;
        if (newValue && this.recurringExpense && this.recurringExpense.startDate) {
            const newStartDate = new Date(newValue);
            const { value, conflicts } = this.componentType === ComponentType.ORGANIZATION
                ? await this.organizationRecurringExpenseService.getStartDateUpdateType({
                    newStartDate,
                    recurringExpenseId: this.recurringExpense.id
                })
                : await this.employeeRecurringExpenseService.getStartDateUpdateType({
                    newStartDate,
                    recurringExpenseId: this.recurringExpense.id
                });
            this.startDateUpdateType = value;
            this.conflicts = conflicts;
        }
        this.startDateChangeLoading = false;
    }
    close() {
        this.dialogRef.close();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseMutationComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.NbDialogRef }, { token: i3.Store }, { token: i3.DateRangePickerBuilderService }, { token: i3.EmployeesService }, { token: i3.ExpenseCategoriesStoreService }, { token: i4.TranslateService }, { token: i3.ToastrService }, { token: i3.ErrorHandlingService }, { token: i3.OrganizationRecurringExpenseService }, { token: i3.EmployeeRecurringExpenseService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RecurringExpenseMutationComponent, isStandalone: false, selector: "ga-recurring-expense-mutation", inputs: { recurringExpense: "recurringExpense" }, viewQueries: [{ propertyName: "employeeSelector", first: true, predicate: ["employeeSelector"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <div class=\"cancel\">\n      <i (click)=\"close()\" class=\"fas fa-times\"></i>\n    </div>\n    <h5 class=\"title\">\n      {{\n      (componentType === ComponentTypeEnum.EMPLOYEE\n      ? 'EMPLOYEES_PAGE.RECURRING_EXPENSE'\n      : 'ORGANIZATIONS_PAGE.RECURRING_EXPENSE'\n      ) | translate\n      }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <form [formGroup]=\"form\">\n      @if (componentType === ComponentTypeEnum.EMPLOYEE) {\n        <div class=\"row\" [hidden]=\"recurringExpense\">\n          <div class=\"col-sm-12 mb-3\">\n            <ga-employee-selector\n              #employeeSelector\n              placeholder=\"Employee\"\n              [defaultSelected]=\"true\"\n              [showAllEmployeesOption]=\"true\"\n              [skipGlobalChange]=\"true\"\n              class=\"employees\"\n            ></ga-employee-selector>\n          </div>\n        </div>\n      }\n      <div class=\"row\">\n        <div class=\"col\">\n          <div class=\"form-group\">\n            <label class=\"label\" for=\"categoryInput\">{{ 'POP_UPS.CATEGORY_NAME' | translate }}</label>\n            <ng-select\n              [items]=\"defaultFilteredCategories\"\n              [addTag]=\"addNewCustomCategory\"\n              id=\"categoryInput\"\n              [searchable]=\"true\"\n              fullWidth\n              [placeholder]=\"'POP_UPS.CATEGORY_NAME' | translate\"\n              formControlName=\"categoryName\"\n              bindValue=\"value\"\n              appendTo=\"body\"\n            ></ng-select>\n          </div>\n        </div>\n      </div>\n      @if (componentType === ComponentTypeEnum.ORGANIZATION) {\n        <div class=\"row\">\n          <div class=\"col\">\n            <div class=\"form-group\">\n              <nb-checkbox formControlName=\"splitExpense\">\n                <span nbTooltip=\"{{ 'EXPENSES_PAGE.SPLIT_HELP' | translate }}\">{{\n                  'EXPENSES_PAGE.SPLIT_EXPENSE' | translate\n                }}</span>\n              </nb-checkbox>\n            </div>\n          </div>\n        </div>\n      }\n      <div class=\"row\">\n        <div class=\"col-6\">\n          <div class=\"form-group\">\n            <label class=\"label\" for=\"valueInput\">{{ 'SM_TABLE.VALUE' | translate }}</label>\n            <input\n              [placeholder]=\"'SM_TABLE.VALUE' | translate\"\n              fullWidth\n              id=\"valueInput\"\n              type=\"number\"\n              [min]=\"0\"\n              step=\"0.1\"\n              nbInput\n              formControlName=\"value\"\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <ga-currency formControlName=\"currency\" [formControl]=\"form.get('currency')\"></ga-currency>\n          </div>\n        </div>\n        <!-- TODO: translate -->\n        @if (recurringExpense) {\n          <div class=\"row\">\n            <div class=\"col\">\n              <div class=\"form-group\">\n                <label> Starts On </label>\n                <input\n                  [nbDatepicker]=\"datepicker\"\n                  nbInput\n                  fullWidth\n                  [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                  formControlName=\"startDate\"\n                  (ngModelChange)=\"datePickerChanged($event)\"\n                  />\n                  <nb-datepicker #datepicker></nb-datepicker>\n                  <div\n                    style=\"margin-top: 10px\"\n                    [nbSpinner]=\"startDateChangeLoading\"\n                    nbSpinnerStatus=\"danger\"\n                    nbSpinnerSize=\"large\"\n                    nbSpinnerMessage=\"\"\n                    >\n                  @switch (startDateUpdateType) {\n                    @case ('REDUCE_CONFLICT') {\n                      <nb-alert status=\"warning\">\n                        {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.WARNING' | translate }}\n                        @for (conflict of conflicts; track conflict) {\n                          <span>\n                            {{ conflict.value | currency : conflict.currency }}:\n                            {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FROM' | translate }}\n                            {{ formatToOrganizationDate(conflict.startDate) }}\n                            {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.TO' | translate }}\n                            {{ formatToOrganizationDate(conflict.endDate) }}</span\n                            >\n                            }{{ 'EXPENSES_PAGE.RECURRING_EXPENSES.VALUE_OVERWRITTEN' | translate }}\n                            {{ month(startDate) }}!\n                          </nb-alert>\n                        }\n                        @case ('INCREASE_CONFLICT') {\n                          <nb-alert status=\"danger\">\n                            {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.ERROR' | translate }}\n                            @for (conflict of conflicts; track conflict) {\n                              <span>\n                                {{ conflict.value | currency : conflict.currency }}:\n                                {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FROM' | translate }}\n                                {{ formatToOrganizationDate(conflict.startDate) }}\n                                {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.TO' | translate }}\n                                {{ formatToOrganizationDate(conflict.endDate) }}</span\n                                >\n                              }\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.NOT_SUPPORTED' | translate }}\n                            </nb-alert>\n                          }\n                          @case ('INCREASE_SAFE_WITHIN_LIMIT') {\n                            <nb-alert status=\"warning\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.EDIT_FUTURE_VALUE' | translate }}\n                              {{ formatToOrganizationDate(startDate) }},\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.EXISTING_VALUE' | translate }}\n                              {{ recurringExpense.value | currency : recurringExpense.currency }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.STARTED_ON' | translate }}\n                              {{ formatToOrganizationDate(recurringExpense.startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.AFFECTED' | translate }}\n                              {{ previousMonth(startDate) }}.\n                            </nb-alert>\n                          }\n                          @case ('INCREASE_SAFE_OUTSIDE_LIMIT') {\n                            <nb-alert status=\"warning\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.SET_EXPENSE_VALUE' | translate }}\n                              {{ value | currency : recurringExpense.currency }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FROM' | translate }}\n                              {{ formatToOrganizationDate(startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.ONWARDS' | translate }}\n                              {{ recurringExpense.value | currency : recurringExpense.currency }}\n                              ({{ 'EXPENSES_PAGE.RECURRING_EXPENSES.STARTED_ON' | translate }}\n                              {{ formatToOrganizationDate(recurringExpense.startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.ENDING_ON' | translate }}\n                              {{ formatToOrganizationDate(recurringExpense.endDate) }})\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.SET_UNTIL' | translate }}\n                              {{ previousMonth(startDate) }}.\n                            </nb-alert>\n                          }\n                          @case ('REDUCE_SAFE') {\n                            <nb-alert status=\"warning\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.SET_UNTIL' | translate }}\n                              {{ formatToOrganizationDate(startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FOR_EXPENSE_VALUE' | translate }}\n                              {{ value | currency : currencyValue }}\n                            </nb-alert>\n                          }\n                          @case ('WITHIN_MONTH') {\n                            <nb-alert status=\"primary\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.CHANGE_START_DATE' | translate }}\n                              {{ formatToOrganizationDate(startDate) }}\n                            </nb-alert>\n                          }\n                        }\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              }\n            </form>\n          </nb-card-body>\n          <nb-card-footer>\n            <button (click)=\"close()\" nbButton size=\"small\" outline class=\"mr-2\" status=\"basic\">\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n            @if (!recurringExpense) {\n              <button\n                (click)=\"submitForm()\"\n                size=\"small\"\n                [disabled]=\"form.invalid\"\n                type=\"submit\"\n                nbButton\n                status=\"success\"\n                [nbTooltip]=\"'EMPLOYEES_PAGE.RECURRING_EXPENSE_ADD' | translate\"\n                >\n                {{ 'BUTTONS.SAVE' | translate }}\n              </button>\n            }\n            @if (recurringExpense) {\n              <button\n                (click)=\"submitForm()\"\n                size=\"small\"\n                [disabled]=\"form.invalid || startDateUpdateType === 'INCREASE_CONFLICT'\"\n                type=\"submit\"\n                nbButton\n                status=\"success\"\n                >\n                {{ 'BUTTONS.EDIT' | translate }}\n              </button>\n            }\n          </nb-card-footer>\n        </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}nb-card-body{width:500px;max-width:100%}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-1, var(--card-background-color))}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i2.NbAlertComponent, selector: "nb-alert", inputs: ["size", "status", "accent", "outline", "closable"], outputs: ["close"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "directive", type: i2.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i2.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i6.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "component", type: i7.CurrencyComponent, selector: "ga-currency", inputs: ["formControl", "currency", "placeholder", "label"], outputs: ["optionChange"] }, { kind: "pipe", type: i8.CurrencyPipe, name: "currency" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
RecurringExpenseMutationComponent = RecurringExpenseMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [UntypedFormBuilder,
        NbDialogRef,
        Store,
        DateRangePickerBuilderService,
        EmployeesService,
        ExpenseCategoriesStoreService,
        TranslateService,
        ToastrService,
        ErrorHandlingService,
        OrganizationRecurringExpenseService,
        EmployeeRecurringExpenseService])
], RecurringExpenseMutationComponent);
export { RecurringExpenseMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecurringExpenseMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-recurring-expense-mutation', standalone: false, template: "<nb-card class=\"main\">\n  <nb-card-header class=\"d-flex flex-column\">\n    <div class=\"cancel\">\n      <i (click)=\"close()\" class=\"fas fa-times\"></i>\n    </div>\n    <h5 class=\"title\">\n      {{\n      (componentType === ComponentTypeEnum.EMPLOYEE\n      ? 'EMPLOYEES_PAGE.RECURRING_EXPENSE'\n      : 'ORGANIZATIONS_PAGE.RECURRING_EXPENSE'\n      ) | translate\n      }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <form [formGroup]=\"form\">\n      @if (componentType === ComponentTypeEnum.EMPLOYEE) {\n        <div class=\"row\" [hidden]=\"recurringExpense\">\n          <div class=\"col-sm-12 mb-3\">\n            <ga-employee-selector\n              #employeeSelector\n              placeholder=\"Employee\"\n              [defaultSelected]=\"true\"\n              [showAllEmployeesOption]=\"true\"\n              [skipGlobalChange]=\"true\"\n              class=\"employees\"\n            ></ga-employee-selector>\n          </div>\n        </div>\n      }\n      <div class=\"row\">\n        <div class=\"col\">\n          <div class=\"form-group\">\n            <label class=\"label\" for=\"categoryInput\">{{ 'POP_UPS.CATEGORY_NAME' | translate }}</label>\n            <ng-select\n              [items]=\"defaultFilteredCategories\"\n              [addTag]=\"addNewCustomCategory\"\n              id=\"categoryInput\"\n              [searchable]=\"true\"\n              fullWidth\n              [placeholder]=\"'POP_UPS.CATEGORY_NAME' | translate\"\n              formControlName=\"categoryName\"\n              bindValue=\"value\"\n              appendTo=\"body\"\n            ></ng-select>\n          </div>\n        </div>\n      </div>\n      @if (componentType === ComponentTypeEnum.ORGANIZATION) {\n        <div class=\"row\">\n          <div class=\"col\">\n            <div class=\"form-group\">\n              <nb-checkbox formControlName=\"splitExpense\">\n                <span nbTooltip=\"{{ 'EXPENSES_PAGE.SPLIT_HELP' | translate }}\">{{\n                  'EXPENSES_PAGE.SPLIT_EXPENSE' | translate\n                }}</span>\n              </nb-checkbox>\n            </div>\n          </div>\n        </div>\n      }\n      <div class=\"row\">\n        <div class=\"col-6\">\n          <div class=\"form-group\">\n            <label class=\"label\" for=\"valueInput\">{{ 'SM_TABLE.VALUE' | translate }}</label>\n            <input\n              [placeholder]=\"'SM_TABLE.VALUE' | translate\"\n              fullWidth\n              id=\"valueInput\"\n              type=\"number\"\n              [min]=\"0\"\n              step=\"0.1\"\n              nbInput\n              formControlName=\"value\"\n              />\n            </div>\n          </div>\n          <div class=\"col-sm-6\">\n            <ga-currency formControlName=\"currency\" [formControl]=\"form.get('currency')\"></ga-currency>\n          </div>\n        </div>\n        <!-- TODO: translate -->\n        @if (recurringExpense) {\n          <div class=\"row\">\n            <div class=\"col\">\n              <div class=\"form-group\">\n                <label> Starts On </label>\n                <input\n                  [nbDatepicker]=\"datepicker\"\n                  nbInput\n                  fullWidth\n                  [placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n                  formControlName=\"startDate\"\n                  (ngModelChange)=\"datePickerChanged($event)\"\n                  />\n                  <nb-datepicker #datepicker></nb-datepicker>\n                  <div\n                    style=\"margin-top: 10px\"\n                    [nbSpinner]=\"startDateChangeLoading\"\n                    nbSpinnerStatus=\"danger\"\n                    nbSpinnerSize=\"large\"\n                    nbSpinnerMessage=\"\"\n                    >\n                  @switch (startDateUpdateType) {\n                    @case ('REDUCE_CONFLICT') {\n                      <nb-alert status=\"warning\">\n                        {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.WARNING' | translate }}\n                        @for (conflict of conflicts; track conflict) {\n                          <span>\n                            {{ conflict.value | currency : conflict.currency }}:\n                            {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FROM' | translate }}\n                            {{ formatToOrganizationDate(conflict.startDate) }}\n                            {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.TO' | translate }}\n                            {{ formatToOrganizationDate(conflict.endDate) }}</span\n                            >\n                            }{{ 'EXPENSES_PAGE.RECURRING_EXPENSES.VALUE_OVERWRITTEN' | translate }}\n                            {{ month(startDate) }}!\n                          </nb-alert>\n                        }\n                        @case ('INCREASE_CONFLICT') {\n                          <nb-alert status=\"danger\">\n                            {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.ERROR' | translate }}\n                            @for (conflict of conflicts; track conflict) {\n                              <span>\n                                {{ conflict.value | currency : conflict.currency }}:\n                                {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FROM' | translate }}\n                                {{ formatToOrganizationDate(conflict.startDate) }}\n                                {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.TO' | translate }}\n                                {{ formatToOrganizationDate(conflict.endDate) }}</span\n                                >\n                              }\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.NOT_SUPPORTED' | translate }}\n                            </nb-alert>\n                          }\n                          @case ('INCREASE_SAFE_WITHIN_LIMIT') {\n                            <nb-alert status=\"warning\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.EDIT_FUTURE_VALUE' | translate }}\n                              {{ formatToOrganizationDate(startDate) }},\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.EXISTING_VALUE' | translate }}\n                              {{ recurringExpense.value | currency : recurringExpense.currency }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.STARTED_ON' | translate }}\n                              {{ formatToOrganizationDate(recurringExpense.startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.AFFECTED' | translate }}\n                              {{ previousMonth(startDate) }}.\n                            </nb-alert>\n                          }\n                          @case ('INCREASE_SAFE_OUTSIDE_LIMIT') {\n                            <nb-alert status=\"warning\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.SET_EXPENSE_VALUE' | translate }}\n                              {{ value | currency : recurringExpense.currency }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FROM' | translate }}\n                              {{ formatToOrganizationDate(startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.ONWARDS' | translate }}\n                              {{ recurringExpense.value | currency : recurringExpense.currency }}\n                              ({{ 'EXPENSES_PAGE.RECURRING_EXPENSES.STARTED_ON' | translate }}\n                              {{ formatToOrganizationDate(recurringExpense.startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.ENDING_ON' | translate }}\n                              {{ formatToOrganizationDate(recurringExpense.endDate) }})\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.SET_UNTIL' | translate }}\n                              {{ previousMonth(startDate) }}.\n                            </nb-alert>\n                          }\n                          @case ('REDUCE_SAFE') {\n                            <nb-alert status=\"warning\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.SET_UNTIL' | translate }}\n                              {{ formatToOrganizationDate(startDate) }}\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.FOR_EXPENSE_VALUE' | translate }}\n                              {{ value | currency : currencyValue }}\n                            </nb-alert>\n                          }\n                          @case ('WITHIN_MONTH') {\n                            <nb-alert status=\"primary\">\n                              {{ 'EXPENSES_PAGE.RECURRING_EXPENSES.CHANGE_START_DATE' | translate }}\n                              {{ formatToOrganizationDate(startDate) }}\n                            </nb-alert>\n                          }\n                        }\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              }\n            </form>\n          </nb-card-body>\n          <nb-card-footer>\n            <button (click)=\"close()\" nbButton size=\"small\" outline class=\"mr-2\" status=\"basic\">\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n            @if (!recurringExpense) {\n              <button\n                (click)=\"submitForm()\"\n                size=\"small\"\n                [disabled]=\"form.invalid\"\n                type=\"submit\"\n                nbButton\n                status=\"success\"\n                [nbTooltip]=\"'EMPLOYEES_PAGE.RECURRING_EXPENSE_ADD' | translate\"\n                >\n                {{ 'BUTTONS.SAVE' | translate }}\n              </button>\n            }\n            @if (recurringExpense) {\n              <button\n                (click)=\"submitForm()\"\n                size=\"small\"\n                [disabled]=\"form.invalid || startDateUpdateType === 'INCREASE_CONFLICT'\"\n                type=\"submit\"\n                nbButton\n                status=\"success\"\n                >\n                {{ 'BUTTONS.EDIT' | translate }}\n              </button>\n            }\n          </nb-card-footer>\n        </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}nb-card-body{width:500px;max-width:100%}:host nb-card,:host nb-card-body{background-color:var(--gauzy-card-1, var(--card-background-color))}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.NbDialogRef }, { type: i3.Store }, { type: i3.DateRangePickerBuilderService }, { type: i3.EmployeesService }, { type: i3.ExpenseCategoriesStoreService }, { type: i4.TranslateService }, { type: i3.ToastrService }, { type: i3.ErrorHandlingService }, { type: i3.OrganizationRecurringExpenseService }, { type: i3.EmployeeRecurringExpenseService }], propDecorators: { employeeSelector: [{
                type: ViewChild,
                args: ['employeeSelector', { static: false }]
            }], recurringExpense: [{
                type: Input
            }] } });
//# sourceMappingURL=recurring-expense-mutation.component.js.map