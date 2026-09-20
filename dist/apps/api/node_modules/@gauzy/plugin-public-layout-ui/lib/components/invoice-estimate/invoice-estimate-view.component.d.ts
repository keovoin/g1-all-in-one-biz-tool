import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IInvoice } from '@gauzy/contracts';
import { ErrorHandlingService, InvoicesService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class InvoiceEstimateViewComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly _activatedRoute;
    private readonly _invoicesService;
    private readonly _errorHandlingService;
    invoice$: Observable<IInvoice>;
    constructor(translateService: TranslateService, _activatedRoute: ActivatedRoute, _invoicesService: InvoicesService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvoiceEstimateViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InvoiceEstimateViewComponent, "gz-public-invoice-estimate-view", never, {}, {}, never, never, false, never>;
}
