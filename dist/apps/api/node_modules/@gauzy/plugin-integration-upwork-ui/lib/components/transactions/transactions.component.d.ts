import { OnInit, WritableSignal } from '@angular/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class TransactionsComponent extends TranslationBaseComponent implements OnInit {
    private readonly _upworkService;
    private readonly _store;
    private readonly _toastrService;
    private readonly _errorHandler;
    protected loading: WritableSignal<boolean>;
    private _selectedOrganizationId;
    file: File | null;
    constructor();
    ngOnInit(): void;
    imageUrlChanged(event: any): void;
    importCsv(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TransactionsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TransactionsComponent, "ngx-transactions", never, {}, {}, never, never, false, never>;
}
