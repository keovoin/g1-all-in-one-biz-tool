import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlingService, InvoicesService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@angular/common";
let InvoiceEstimateViewComponent = class InvoiceEstimateViewComponent extends TranslationBaseComponent {
    constructor(translateService, _activatedRoute, _invoicesService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._activatedRoute = _activatedRoute;
        this._invoicesService = _invoicesService;
        this._errorHandlingService = _errorHandlingService;
    }
    ngOnInit() {
        // Define relations to fetch
        const relations = [
            'invoiceItems',
            'invoiceItems.employee',
            'invoiceItems.employee.user',
            'invoiceItems.project',
            'invoiceItems.product',
            'invoiceItems.expense',
            'invoiceItems.task',
            'fromOrganization',
            'toContact'
        ];
        this.invoice$ = this._activatedRoute.params.pipe(
        // Ensure that id and token are present in route params
        filter(({ id, token }) => Boolean(id && token)), 
        // Fetch the invoice data based on route params
        switchMap(({ id, token }) => this._invoicesService.getPublicInvoice(id, token, relations)), 
        // Handle errors gracefully
        catchError((error) => {
            console.error('Error while fetching public invoice', error);
            this._errorHandlingService.handleError(error);
            return of(null); // Return null to ensure observable continues
        }), 
        // Automatically unsubscribe to prevent memory leaks
        untilDestroyed(this));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceEstimateViewComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i3.InvoicesService }, { token: i3.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: InvoiceEstimateViewComponent, isStandalone: false, selector: "gz-public-invoice-estimate-view", usesInheritance: true, ngImport: i0, template: "@if (invoice$ | async; as invoice) {\n  <nb-card>\n    <nb-card-header class=\"d-flex\">\n      <h3>\n        {{ (invoice.isEstimate ? 'INVOICES_PAGE.VIEW_ESTIMATE' : 'INVOICES_PAGE.VIEW_INVOICE') | translate }}\n      </h3>\n    </nb-card-header>\n    <nb-card-body class=\"invoice-body\">\n      <ga-invoice-view-inner [invoice]=\"invoice\" [isEstimate]=\"invoice.isEstimate\"></ga-invoice-view-inner>\n    </nb-card-body>\n  </nb-card>\n}\n", styles: [""], dependencies: [{ kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i5.InvoiceViewInnerComponent, selector: "ga-invoice-view-inner", inputs: ["invoice", "isEstimate", "buttonsOutlet"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }] }); }
};
InvoiceEstimateViewComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        InvoicesService,
        ErrorHandlingService])
], InvoiceEstimateViewComponent);
export { InvoiceEstimateViewComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceEstimateViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-public-invoice-estimate-view', standalone: false, template: "@if (invoice$ | async; as invoice) {\n  <nb-card>\n    <nb-card-header class=\"d-flex\">\n      <h3>\n        {{ (invoice.isEstimate ? 'INVOICES_PAGE.VIEW_ESTIMATE' : 'INVOICES_PAGE.VIEW_INVOICE') | translate }}\n      </h3>\n    </nb-card-header>\n    <nb-card-body class=\"invoice-body\">\n      <ga-invoice-view-inner [invoice]=\"invoice\" [isEstimate]=\"invoice.isEstimate\"></ga-invoice-view-inner>\n    </nb-card-body>\n  </nb-card>\n}\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i3.InvoicesService }, { type: i3.ErrorHandlingService }] });
//# sourceMappingURL=invoice-estimate-view.component.js.map