var ExpensesMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, tap } from 'rxjs/operators';
import { TaxTypesEnum, ExpenseTypesEnum, ExpenseStatusesEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { OrganizationSettingService, Store } from '@gauzy/ui-core/core';
import { AttachReceiptComponent } from './attach-receipt/attach-receipt.component';
import { FormHelpers } from '../../forms/helpers';
import { ALL_EMPLOYEES_SELECTED } from '../../selectors/employee/default-employee';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@ngx-translate/core";
import * as i5 from "../../modules/currency/currency.component";
import * as i6 from "../../vendor-select/vendor-select.component";
import * as i7 from "../expense-category-select/expense-category-select.component";
import * as i8 from "../../contact-select/contact-select.component";
import * as i9 from "../../selectors/employee/employee.component";
import * as i10 from "../../selectors/project/project/project.component";
import * as i11 from "../../tags/tags-color-input/tags-color-input.component";
let ExpensesMutationComponent = class ExpensesMutationComponent extends TranslationBaseComponent {
    static { ExpensesMutationComponent_1 = this; }
    get expense() {
        return this._expense;
    }
    set expense(expense) {
        if (expense) {
            this._expense = expense;
            this._initializeForm();
        }
    }
    static buildForm(fb, self) {
        return fb.group({
            amount: ['', Validators.required],
            vendor: [],
            typeOfExpense: [ExpenseTypesEnum.TAX_DEDUCTIBLE],
            category: [],
            notes: [],
            currency: ['', Validators.required],
            valueDate: [self.organizationSettingService.getDateFromOrganizationSettings(), Validators.required],
            purpose: [],
            organizationContact: [],
            organizationContactId: [],
            projectId: [],
            project: [],
            taxType: [TaxTypesEnum.PERCENTAGE],
            taxLabel: [],
            rateValue: [0],
            receipt: [self.defaultImage],
            splitExpense: [false],
            tags: [],
            employee: [],
            status: []
        });
    }
    constructor(dialogRef, dialogService, fb, store, translateService, organizationSettingService) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.dialogService = dialogService;
        this.fb = fb;
        this.store = store;
        this.translateService = translateService;
        this.organizationSettingService = organizationSettingService;
        this.FormHelpers = FormHelpers;
        this.expenseTypes = Object.values(ExpenseTypesEnum);
        this.expenseTypesEnum = ExpenseTypesEnum;
        this.taxTypes = Object.values(TaxTypesEnum);
        this.statuses = [];
        this.defaultImage = './assets/images/others/invoice-template.png';
        this.calculatedValue = '0';
        this.showNotes = false;
        this.showWarning = false;
        this.showTooltip = false;
        this.showTaxesInput = false;
        /*
         * Expense Mutation Form
         */
        this.form = ExpensesMutationComponent_1.buildForm(this.fb, this);
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => {
            const typeOfExpense = this.form.get('typeOfExpense');
            this.setExpenseStatuses(typeOfExpense.value);
        }), untilDestroyed(this))
            .subscribe();
        this.form
            .get('typeOfExpense')
            .valueChanges.pipe(untilDestroyed(this))
            .subscribe(() => {
            this.form.get('status').setValue(null);
            this.form.get('status').updateValueAndValidity();
        });
    }
    ngAfterViewInit() { }
    /**
     * Added statuses dropdown selector
     */
    setExpenseStatuses(typeOfExpense) {
        const statuses = Object.values(ExpenseStatusesEnum);
        if (typeOfExpense === ExpenseTypesEnum.BILLABLE_TO_CONTACT) {
            this.statuses = statuses.filter((status) => status != ExpenseStatusesEnum.NOT_BILLABLE);
        }
        else {
            this.statuses = statuses.filter((status) => status == ExpenseStatusesEnum.NOT_BILLABLE);
        }
    }
    /**
     * Selected Organization Contact
     *
     * @param contact
     */
    selectedOrganizationContact(contact) {
        if (contact) {
            this.form.get('organizationContactId').setValue(contact.id);
            this.form.get('organizationContactId').updateValueAndValidity();
        }
    }
    /**
     * Selected Project
     *
     * @param project
     */
    selectedProject(project) {
        this.form.get('project').setValue(project);
        this.form.get('project').updateValueAndValidity();
    }
    /**
     * Selected Tags Handler
     *
     * @param tags
     */
    selectedTagsHandler(tags) {
        this.form.get('tags').setValue(tags);
        this.form.get('tags').updateValueAndValidity();
    }
    async addOrEditExpense() {
        const { typeOfExpense, organizationContact } = this.form.getRawValue();
        if (typeOfExpense === ExpenseTypesEnum.BILLABLE_TO_CONTACT && !organizationContact) {
            this.showWarning = true;
            setTimeout(() => {
                this.closeWarning();
            }, 3000);
            return;
        }
        else {
            this.closeWarning();
        }
        if (this.form.invalid) {
            return;
        }
        this.dialogRef.close(Object.assign(this.form.getRawValue(), {
            splitExpense: this.showTooltip
        }));
    }
    showNotesInput() {
        return (this.showNotes = !this.showNotes);
    }
    includeTaxes() {
        this.calculateTaxes();
        return (this.showTaxesInput = !this.showTaxesInput);
    }
    _initializeForm() {
        if (this.expense) {
            const { project, organizationContact } = this.expense;
            this.form.patchValue({
                amount: this.expense.amount,
                vendor: this.expense.vendor,
                typeOfExpense: this.expense.typeOfExpense,
                category: this.expense.category,
                notes: this.expense.notes,
                currency: this.expense.currency,
                valueDate: new Date(this.expense.valueDate),
                purpose: this.expense.purpose,
                organizationContact: organizationContact,
                organizationContactId: organizationContact ? organizationContact.id : null,
                project: project,
                projectId: project ? project.id : null,
                taxType: this.expense.taxType,
                taxLabel: this.expense.taxLabel,
                rateValue: this.expense.rateValue,
                receipt: this.expense.receipt,
                splitExpense: this.expense.splitExpense,
                tags: this.expense.tags,
                status: this.expense.status,
                employee: this.expense.employee
            });
            if (this.expense.taxLabel) {
                this.includeTaxes();
            }
            if (this.expense.notes) {
                this.showNotesInput();
            }
        }
    }
    calculateTaxes() {
        this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((val) => {
            const amount = val.amount;
            const rate = val.rateValue;
            const oldNotes = val.notes;
            if (val.taxType === TaxTypesEnum.PERCENTAGE) {
                const result = (amount / (rate + 100)) * 100 * (rate / 100);
                this.calculatedValue =
                    `${this.getTranslation('EXPENSES_PAGE.MUTATION.TAX_AMOUNT')}: ` +
                        result.toFixed(2) +
                        ' ' +
                        val.currency;
            }
            else {
                const result = (rate / (amount - rate)) * 100;
                this.calculatedValue =
                    `${this.getTranslation('EXPENSES_PAGE.MUTATION.TAX_RATE')}: ` + result.toFixed(2) + ' %';
            }
            if (rate !== 0) {
                val.notes = this.calculatedValue + '. ' + oldNotes;
            }
        });
    }
    closeWarning() {
        this.showWarning = !this.showWarning;
    }
    attachReceipt() {
        this.dialogService
            .open(AttachReceiptComponent, {
            context: {
                currentReceipt: this.form.value.receipt
            },
            closeOnBackdropClick: false,
            closeOnEsc: false
        })
            .onClose.pipe(tap((receipt) => {
            this.form.get('receipt').setValue(receipt);
            this.form.get('receipt').updateValueAndValidity();
        }), untilDestroyed(this))
            .subscribe();
    }
    onEmployeeChange(employee) {
        this.showTooltip = !employee || JSON.stringify(employee) == JSON.stringify(ALL_EMPLOYEES_SELECTED);
        if (employee) {
            this.form.get('employee').setValue(employee);
            this.form.get('employee').updateValueAndValidity();
        }
    }
    close() {
        this.dialogRef.close();
    }
    /*
     * On Changed Currency Event Emitter
     */
    currencyChanged(currency) {
        this.form.get('currency').setValue(currency.isoCode);
        this.form.get('currency').updateValueAndValidity();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpensesMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i1.NbDialogService }, { token: i2.UntypedFormBuilder }, { token: i3.Store }, { token: i4.TranslateService }, { token: i3.OrganizationSettingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ExpensesMutationComponent, isStandalone: false, selector: "ga-expenses-mutation", inputs: { expense: "expense" }, usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<div class=\"cancel\">\n\t\t\t<i class=\"fas fa-times\" (click)=\"close()\"></i>\n\t\t</div>\n\t\t<div>\n\t\t\t@if (expense) {\n\t\t\t<h4 class=\"title\">\n\t\t\t\t{{ (duplicate ? 'POP_UPS.DUPLICATE' : 'POP_UPS.EDIT_EXPENSE') | translate }}\n\t\t\t</h4>\n\t\t\t} @else {\n\t\t\t<h4 class=\"title\">\n\t\t\t\t{{ 'POP_UPS.ADD_EXPENSE' | translate }}\n\t\t\t</h4>\n\t\t\t}\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"text-center\">\n\t\t\t\t<nb-radio-group formControlName=\"typeOfExpense\">\n\t\t\t\t\t@for (expenseType of expenseTypes; track expenseType) {\n\t\t\t\t\t<nb-radio [value]=\"expenseType\" (valueChange)=\"setExpenseStatuses($event)\">\n\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.' + expenseType | translate }}\n\t\t\t\t\t</nb-radio>\n\t\t\t\t\t}\n\t\t\t\t</nb-radio-group>\n\t\t\t</div>\n\t\t\t<div class=\"row employees\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<label class=\"label\" for=\"status\" [hidden]=\"expense && !duplicate\">\n\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.EMPLOYEES_GENERATE_EXPENSE' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[hidden]=\"expense && !duplicate\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\tclass=\"employees\"\n\t\t\t\t\t\t[placeholder]=\"'EXPENSES_PAGE.MUTATION.EMPLOYEES_GENERATE_EXPENSE' | translate\"\n\t\t\t\t\t\t[defaultSelected]=\"true\"\n\t\t\t\t\t\t(selectionChanged)=\"onEmployeeChange($event)\"\n\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6 categories\" [class.col-sm-12]=\"expense && !duplicate\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.CATEGORIES' | translate }}</label>\n\t\t\t\t\t\t<ga-expense-category-select\n\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\tformControlName=\"category\"\n\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.ALL_CATEGORIES' | translate\"\n\t\t\t\t\t\t></ga-expense-category-select>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.DATE' | translate }}</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tformControlName=\"valueDate\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tclass=\"datepicker\"\n\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n\t\t\t\t\t\t[nbDatepicker]=\"valueDatePicker\"\n\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'valueDate') ? 'danger' : 'basic'\"\n\t\t\t\t\t/>\n\t\t\t\t\t<nb-datepicker #valueDatePicker></nb-datepicker>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.ALL_VENDORS' | translate }}</label>\n\t\t\t\t\t\t<ga-vendor-select\n\t\t\t\t\t\t\tformControlName=\"vendor\"\n\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.ALL_VENDORS' | translate\"\n\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t></ga-vendor-select>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label d-flex align-items-center\">\n\t\t\t\t\t\t\t{{ 'POP_UPS.AMOUNT' | translate }}\n\t\t\t\t\t\t\t@if (showTooltip) {\n\t\t\t\t\t\t\t<span class=\"help-text ml-2\" [nbTooltip]=\"'EXPENSES_PAGE.SPLIT_HELP' | translate\">\n\t\t\t\t\t\t\t\t<nb-icon size=\"small\" status=\"danger\" icon=\"alert-triangle-outline\"></nb-icon>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\tstep=\"1\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.AMOUNT' | translate\"\n\t\t\t\t\t\t\tformControlName=\"amount\"\n\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'amount') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<ga-currency formControlName=\"currency\" (optionChange)=\"currencyChanged($event)\"></ga-currency>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.PURPOSE' | translate }}</label>\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"purpose\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PURPOSE' | translate\"\n\t\t\t\t\t\t></textarea>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t@if (showWarning) {\n\t\t\t<nb-card accent=\"warning\" class=\"p-3\">\n\t\t\t\t<nb-icon class=\"ml-auto close\" (click)=\"closeWarning()\" icon=\"close-outline\"></nb-icon>\n\t\t\t\t<p>\n\t\t\t\t\t<b>{{ 'EXPENSES_PAGE.MUTATION.CONTACT_IS_REQUIRED' | translate }}</b>\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.PLEASE_SELECT_A_CONTACT_OR_CHANGE_EXPENSE_TYPE' | translate }}\n\t\t\t\t</p>\n\t\t\t</nb-card>\n\t\t\t}\n\t\t\t<div>\n\t\t\t\t<h6 class=\"title mb-3\">\n\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.ASSIGN_TO' | translate }}\n\t\t\t\t</h6>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'CONTEXT_MENU.CONTACT' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ga-contact-select\n\t\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'CONTEXT_MENU.CONTACT' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t\t(onChanged)=\"selectedOrganizationContact($event)\"\n\t\t\t\t\t\t\t></ga-contact-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'CONTEXT_MENU.PROJECT' | translate }}</label>\n\t\t\t\t\t\t\t<ga-project-selector\n\t\t\t\t\t\t\t\tformControlName=\"projectId\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'CONTEXT_MENU.PROJECT' | translate\"\n\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t\t\t(onChanged)=\"selectedProject($event)\"\n\t\t\t\t\t\t\t></ga-project-selector>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsHandler($event)\"\n\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"status\">\n\t\t\t\t\t\t\t{{ 'FORM.LABELS.STATUS' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tid=\"status\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT_STATUS' | translate\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"status\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (status of statuses; track status) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"status\">\n\t\t\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.' + status | translate }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t<div class=\"mt-2 text-right\">\n\t\t\t\t\t\t@if (!showNotes) {\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t(click)=\"showNotesInput()\"\n\t\t\t\t\t\t\tclass=\"gray ml-2 mt-3\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<i class=\"fas fa-plus mr-1\"></i>\n\t\t\t\t\t\t\t{{ 'BUTTONS.ADD_NOTE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t} @if (!showTaxesInput) {\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t(click)=\"includeTaxes()\"\n\t\t\t\t\t\t\tclass=\"gray ml-2 mt-3\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<i class=\"fas fa-percentage mr-1\"></i>\n\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.INCLUDE_TAXES' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t(click)=\"attachReceipt()\"\n\t\t\t\t\t\t\tclass=\"gray ml-2 mt-3\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<i class=\"fas fa-paperclip mr-1\"></i>\n\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.ATTACH_A_RECEIPT' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t@if (showNotes) {\n\t\t\t<div>\n\t\t\t\t<h6 class=\"title mb-3\">\n\t\t\t\t\t{{ 'POP_UPS.NOTES' | translate }}\n\t\t\t\t</h6>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.NOTES' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"notes\"\n\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'notes') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t} @if (showTaxesInput) {\n\t\t\t<div>\n\t\t\t\t<h6 class=\"title mb-3\">\n\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.INCLUDE_TAXES' | translate }}\n\t\t\t\t</h6>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tformControlName=\"taxLabel\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.TAX_LABEL' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tformControlName=\"taxType\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.TAX_TYPE' | translate\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (taxType of taxTypes; track taxType) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"taxType\">\n\t\t\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.' + taxType | translate }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\tstep=\"1\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"rateValue\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.TAX_RATE' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<input nbInput type=\"text\" fullWidth [placeholder]=\"calculatedValue\" disabled />\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t}\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button [disabled]=\"form.invalid\" (click)=\"addOrEditExpense()\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{height:auto;width:auto}.main .body{width:645px}.main{background-color:var(--gauzy-card-1)}.main nb-card-header .help-text{width:40px;display:flex;align-items:center;justify-content:center}.main nb-card-header nb-icon{cursor:pointer}.categories{width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:flex-end}.categories .form-group{margin-bottom:0;width:100%}.datepicker{width:100%}nb-radio-group{display:flex;flex-direction:row;margin-bottom:1em}.employees{margin-bottom:15px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i1.NbRadioComponent, selector: "nb-radio", inputs: ["name", "checked", "value", "disabled", "status"], outputs: ["valueChange", "blur"] }, { kind: "component", type: i1.NbRadioGroupComponent, selector: "nb-radio-group", inputs: ["value", "name", "disabled", "status"], outputs: ["valueChange"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i5.CurrencyComponent, selector: "ga-currency", inputs: ["formControl", "currency", "placeholder", "label"], outputs: ["optionChange"] }, { kind: "component", type: i6.VendorSelectComponent, selector: "ga-vendor-select", inputs: ["disabled", "placeholder", "clearable", "addTag", "searchable"], outputs: ["onChanged"] }, { kind: "component", type: i7.ExpenseCategorySelectComponent, selector: "ga-expense-category-select", inputs: ["disabled", "placeholder", "clearable", "addTag", "searchable"], outputs: ["onChanged"] }, { kind: "component", type: i8.ContactSelectComponent, selector: "ga-contact-select", inputs: ["disabled", "placeholder", "clearable", "addTag", "searchable"], outputs: ["onChanged"] }, { kind: "component", type: i9.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "component", type: i10.ProjectSelectorComponent, selector: "ga-project-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "projectId", "employeeId", "organizationContactId"], outputs: ["onChanged"] }, { kind: "component", type: i11.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
ExpensesMutationComponent = ExpensesMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        NbDialogService,
        UntypedFormBuilder,
        Store,
        TranslateService,
        OrganizationSettingService])
], ExpensesMutationComponent);
export { ExpensesMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpensesMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-expenses-mutation', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<div class=\"cancel\">\n\t\t\t<i class=\"fas fa-times\" (click)=\"close()\"></i>\n\t\t</div>\n\t\t<div>\n\t\t\t@if (expense) {\n\t\t\t<h4 class=\"title\">\n\t\t\t\t{{ (duplicate ? 'POP_UPS.DUPLICATE' : 'POP_UPS.EDIT_EXPENSE') | translate }}\n\t\t\t</h4>\n\t\t\t} @else {\n\t\t\t<h4 class=\"title\">\n\t\t\t\t{{ 'POP_UPS.ADD_EXPENSE' | translate }}\n\t\t\t</h4>\n\t\t\t}\n\t\t</div>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"text-center\">\n\t\t\t\t<nb-radio-group formControlName=\"typeOfExpense\">\n\t\t\t\t\t@for (expenseType of expenseTypes; track expenseType) {\n\t\t\t\t\t<nb-radio [value]=\"expenseType\" (valueChange)=\"setExpenseStatuses($event)\">\n\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.' + expenseType | translate }}\n\t\t\t\t\t</nb-radio>\n\t\t\t\t\t}\n\t\t\t\t</nb-radio-group>\n\t\t\t</div>\n\t\t\t<div class=\"row employees\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<label class=\"label\" for=\"status\" [hidden]=\"expense && !duplicate\">\n\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.EMPLOYEES_GENERATE_EXPENSE' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[hidden]=\"expense && !duplicate\"\n\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\tclass=\"employees\"\n\t\t\t\t\t\t[placeholder]=\"'EXPENSES_PAGE.MUTATION.EMPLOYEES_GENERATE_EXPENSE' | translate\"\n\t\t\t\t\t\t[defaultSelected]=\"true\"\n\t\t\t\t\t\t(selectionChanged)=\"onEmployeeChange($event)\"\n\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6 categories\" [class.col-sm-12]=\"expense && !duplicate\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.CATEGORIES' | translate }}</label>\n\t\t\t\t\t\t<ga-expense-category-select\n\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\tformControlName=\"category\"\n\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.ALL_CATEGORIES' | translate\"\n\t\t\t\t\t\t></ga-expense-category-select>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.DATE' | translate }}</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tformControlName=\"valueDate\"\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tclass=\"datepicker\"\n\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PICK_DATE' | translate\"\n\t\t\t\t\t\t[nbDatepicker]=\"valueDatePicker\"\n\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'valueDate') ? 'danger' : 'basic'\"\n\t\t\t\t\t/>\n\t\t\t\t\t<nb-datepicker #valueDatePicker></nb-datepicker>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.ALL_VENDORS' | translate }}</label>\n\t\t\t\t\t\t<ga-vendor-select\n\t\t\t\t\t\t\tformControlName=\"vendor\"\n\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.ALL_VENDORS' | translate\"\n\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t></ga-vendor-select>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label d-flex align-items-center\">\n\t\t\t\t\t\t\t{{ 'POP_UPS.AMOUNT' | translate }}\n\t\t\t\t\t\t\t@if (showTooltip) {\n\t\t\t\t\t\t\t<span class=\"help-text ml-2\" [nbTooltip]=\"'EXPENSES_PAGE.SPLIT_HELP' | translate\">\n\t\t\t\t\t\t\t\t<nb-icon size=\"small\" status=\"danger\" icon=\"alert-triangle-outline\"></nb-icon>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\tstep=\"1\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.AMOUNT' | translate\"\n\t\t\t\t\t\t\tformControlName=\"amount\"\n\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'amount') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t<ga-currency formControlName=\"currency\" (optionChange)=\"currencyChanged($event)\"></ga-currency>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.PURPOSE' | translate }}</label>\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tformControlName=\"purpose\"\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.PURPOSE' | translate\"\n\t\t\t\t\t\t></textarea>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t@if (showWarning) {\n\t\t\t<nb-card accent=\"warning\" class=\"p-3\">\n\t\t\t\t<nb-icon class=\"ml-auto close\" (click)=\"closeWarning()\" icon=\"close-outline\"></nb-icon>\n\t\t\t\t<p>\n\t\t\t\t\t<b>{{ 'EXPENSES_PAGE.MUTATION.CONTACT_IS_REQUIRED' | translate }}</b>\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.PLEASE_SELECT_A_CONTACT_OR_CHANGE_EXPENSE_TYPE' | translate }}\n\t\t\t\t</p>\n\t\t\t</nb-card>\n\t\t\t}\n\t\t\t<div>\n\t\t\t\t<h6 class=\"title mb-3\">\n\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.ASSIGN_TO' | translate }}\n\t\t\t\t</h6>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'CONTEXT_MENU.CONTACT' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ga-contact-select\n\t\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'CONTEXT_MENU.CONTACT' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t\t(onChanged)=\"selectedOrganizationContact($event)\"\n\t\t\t\t\t\t\t></ga-contact-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'CONTEXT_MENU.PROJECT' | translate }}</label>\n\t\t\t\t\t\t\t<ga-project-selector\n\t\t\t\t\t\t\t\tformControlName=\"projectId\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'CONTEXT_MENU.PROJECT' | translate\"\n\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t[defaultSelected]=\"false\"\n\t\t\t\t\t\t\t\t[showAllOption]=\"false\"\n\t\t\t\t\t\t\t\t(onChanged)=\"selectedProject($event)\"\n\t\t\t\t\t\t\t></ga-project-selector>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsHandler($event)\"\n\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-4\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" for=\"status\">\n\t\t\t\t\t\t\t{{ 'FORM.LABELS.STATUS' | translate }}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tid=\"status\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.SELECT_STATUS' | translate\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"status\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (status of statuses; track status) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"status\">\n\t\t\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.' + status | translate }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-8\">\n\t\t\t\t\t<div class=\"mt-2 text-right\">\n\t\t\t\t\t\t@if (!showNotes) {\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t(click)=\"showNotesInput()\"\n\t\t\t\t\t\t\tclass=\"gray ml-2 mt-3\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<i class=\"fas fa-plus mr-1\"></i>\n\t\t\t\t\t\t\t{{ 'BUTTONS.ADD_NOTE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t} @if (!showTaxesInput) {\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t(click)=\"includeTaxes()\"\n\t\t\t\t\t\t\tclass=\"gray ml-2 mt-3\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<i class=\"fas fa-percentage mr-1\"></i>\n\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.INCLUDE_TAXES' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t\toutline\n\t\t\t\t\t\t\t(click)=\"attachReceipt()\"\n\t\t\t\t\t\t\tclass=\"gray ml-2 mt-3\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<i class=\"fas fa-paperclip mr-1\"></i>\n\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.ATTACH_A_RECEIPT' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t@if (showNotes) {\n\t\t\t<div>\n\t\t\t\t<h6 class=\"title mb-3\">\n\t\t\t\t\t{{ 'POP_UPS.NOTES' | translate }}\n\t\t\t\t</h6>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<textarea\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.NOTES' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"notes\"\n\t\t\t\t\t\t\t\t[status]=\"FormHelpers.isInvalidControl(form, 'notes') ? 'danger' : 'basic'\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</textarea>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t} @if (showTaxesInput) {\n\t\t\t<div>\n\t\t\t\t<h6 class=\"title mb-3\">\n\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.INCLUDE_TAXES' | translate }}\n\t\t\t\t</h6>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\tformControlName=\"taxLabel\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.TAX_LABEL' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<nb-select\n\t\t\t\t\t\t\t\tformControlName=\"taxType\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.TAX_TYPE' | translate\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@for (taxType of taxTypes; track taxType) {\n\t\t\t\t\t\t\t\t<nb-option [value]=\"taxType\">\n\t\t\t\t\t\t\t\t\t{{ 'EXPENSES_PAGE.MUTATION.' + taxType | translate }}\n\t\t\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</nb-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t\t\t\tstep=\"1\"\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\tformControlName=\"rateValue\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.TAX_RATE' | translate\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t<input nbInput type=\"text\" fullWidth [placeholder]=\"calculatedValue\" disabled />\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t}\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"close()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button [disabled]=\"form.invalid\" (click)=\"addOrEditExpense()\" status=\"success\" nbButton>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}.main{height:auto;width:auto}.main .body{width:645px}.main{background-color:var(--gauzy-card-1)}.main nb-card-header .help-text{width:40px;display:flex;align-items:center;justify-content:center}.main nb-card-header nb-icon{cursor:pointer}.categories{width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:flex-end}.categories .form-group{margin-bottom:0;width:100%}.datepicker{width:100%}nb-radio-group{display:flex;flex-direction:row;margin-bottom:1em}.employees{margin-bottom:15px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i1.NbDialogService }, { type: i2.UntypedFormBuilder }, { type: i3.Store }, { type: i4.TranslateService }, { type: i3.OrganizationSettingService }], propDecorators: { expense: [{
                type: Input
            }] } });
//# sourceMappingURL=expenses-mutation.component.js.map