import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogRef } from '@nebular/theme';
import { LocalDataSource } from 'angular2-smart-table';
import { IEmployeeStatisticsHistory, IOrganization } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { PaginationFilterBaseComponent } from '../../smart-data-layout/pagination/pagination-filter-base.component';
import * as i0 from "@angular/core";
export declare class ProfitHistoryComponent extends PaginationFilterBaseComponent implements OnInit, OnChanges {
    private readonly store;
    readonly translateService: TranslateService;
    private readonly dialogRef?;
    organization: IOrganization;
    smartTableSettings: object;
    smartTableSource: LocalDataSource;
    /**
     * The income/expense rows and their totals.
     *
     * An `@Input()` so the component can be used INLINE (the dashboard-builder
     * widget) as well as through `NbDialogService`, which assigns the field
     * directly from its `context` and is unaffected by the decorator.
     */
    records: {
        incomes: IEmployeeStatisticsHistory[];
        expenses: IEmployeeStatisticsHistory[];
        incomeTotal: number;
        expenseTotal: number;
        profit: number;
    };
    loading: boolean;
    /** Guards {@link ngOnChanges} until the first population has happened in `ngOnInit`. */
    private _initialized;
    private _profitHistory$;
    constructor(store: Store, translateService: TranslateService, dialogRef?: NbDialogRef<ProfitHistoryComponent>);
    /** True when this instance was opened as a dialog, i.e. when it can be closed. */
    get isDialog(): boolean;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Re-renders when the bound records change.
     *
     * Only inline usage rebinds — a dialog is opened with a fixed `context` and
     * never changes it — so this is inert on the dialog path. `ngOnChanges` also
     * runs BEFORE the first `ngOnInit`, which `_initialized` filters out so the
     * table is not populated twice on creation.
     *
     * @param changes - The inputs Angular re-bound.
     */
    ngOnChanges(changes: SimpleChanges): void;
    private _populateSmartTable;
    /**
     *
     */
    loadSettingsSmartTable(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProfitHistoryComponent, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProfitHistoryComponent, "ga-profit-history-selector", never, { "records": { "alias": "records"; "required": false; }; }, {}, never, never, false, never>;
}
