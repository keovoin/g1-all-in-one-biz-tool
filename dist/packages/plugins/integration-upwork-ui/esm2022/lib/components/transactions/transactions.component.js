import { __decorate, __metadata } from "tslib";
import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { filter, tap, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ErrorHandlingService, Store, ToastrService, UpworkService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
let TransactionsComponent = class TransactionsComponent extends TranslationBaseComponent {
    constructor() {
        super(inject(TranslateService));
        this._upworkService = inject(UpworkService);
        this._store = inject(Store);
        this._toastrService = inject(ToastrService);
        this._errorHandler = inject(ErrorHandlingService);
        this.loading = signal(false, ...(ngDevMode ? [{ debugName: "loading" }] : [])); // controls UI state while upload in progress
        this.file = null;
    }
    ngOnInit() {
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), untilDestroyed(this))
            .subscribe((organization) => {
            this._selectedOrganizationId = organization.id;
        });
    }
    imageUrlChanged(event) {
        // files[0] may be undefined if the user cancels the dialog
        const file = event.target.files[0] ?? null;
        this.file = file;
        event.target.value = null;
    }
    importCsv() {
        // nothing to upload or no organization selected
        // guard against null or undefined
        if (this.file == null || !this._selectedOrganizationId) {
            return;
        }
        this.loading.set(true);
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('organizationId', this._selectedOrganizationId);
        this._upworkService
            .uploadTransaction(formData)
            .pipe(untilDestroyed(this), tap(() => (this.file = null)), finalize(() => {
            this.loading.set(false);
        }))
            .subscribe({
            next: ({ totalExpenses, totalIncomes }) => {
                this._toastrService.success(this.getTranslation('INTEGRATIONS.TOTAL_UPWORK_TRANSACTIONS_SUCCEED', {
                    totalExpenses,
                    totalIncomes
                }));
            },
            error: (err) => {
                // added infinite duration to error toastr, error message can be too long to read in 3 sec
                this._errorHandler.handleError(err, 0);
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TransactionsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TransactionsComponent, isStandalone: false, selector: "ngx-transactions", usesInheritance: true, ngImport: i0, template: "<div class=\"d-flex file-uploader-container\">\n\t<input\n\t\t[hidden]=\"true\"\n\t\t(change)=\"imageUrlChanged($event)\"\n\t\t#fileInput\n\t\ttype=\"file\"\n\t\tid=\"fileInput\"\n\t\taccept=\".csv\"\n\t/>\n\n\t<input\n\t\ttype=\"text\"\n\t\tclass=\"form-control\"\n\t\t[value]=\"file?.name\"\n\t\treadonly=\"true\"\n\t\tfullWidth\n\t/>\n\t<button\n\t\tnbButton\n\t\tstatus=\"primary\"\n\t\t(click)=\"fileInput.click()\"\n\t\tclass=\"browse\"\n\t>\n\t\t{{ 'BROWSE' | translate }}\n\t</button>\n\t<button\n\t\t(click)=\"importCsv()\"\n\t\tnbButton\n\t\tstatus=\"success\"\n\t\t[disabled]=\"!file\"\n\t\tclass=\"add\"\n\t>\n\t\t{{ 'BUTTONS.ADD' | translate }}\n\t</button>\n</div>\n", styles: [".file-uploader-container{margin-top:20px}.add{margin-left:20px}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
TransactionsComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], TransactionsComponent);
export { TransactionsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TransactionsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-transactions', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"d-flex file-uploader-container\">\n\t<input\n\t\t[hidden]=\"true\"\n\t\t(change)=\"imageUrlChanged($event)\"\n\t\t#fileInput\n\t\ttype=\"file\"\n\t\tid=\"fileInput\"\n\t\taccept=\".csv\"\n\t/>\n\n\t<input\n\t\ttype=\"text\"\n\t\tclass=\"form-control\"\n\t\t[value]=\"file?.name\"\n\t\treadonly=\"true\"\n\t\tfullWidth\n\t/>\n\t<button\n\t\tnbButton\n\t\tstatus=\"primary\"\n\t\t(click)=\"fileInput.click()\"\n\t\tclass=\"browse\"\n\t>\n\t\t{{ 'BROWSE' | translate }}\n\t</button>\n\t<button\n\t\t(click)=\"importCsv()\"\n\t\tnbButton\n\t\tstatus=\"success\"\n\t\t[disabled]=\"!file\"\n\t\tclass=\"add\"\n\t>\n\t\t{{ 'BUTTONS.ADD' | translate }}\n\t</button>\n</div>\n", styles: [".file-uploader-container{margin-top:20px}.add{margin-left:20px}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=transactions.component.js.map