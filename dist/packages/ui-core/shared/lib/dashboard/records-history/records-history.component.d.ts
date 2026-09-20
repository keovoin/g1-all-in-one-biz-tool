import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'angular2-smart-table';
import { EmployeeStatisticsHistoryEnum as HistoryType, IEmployeeStatisticsHistory } from '@gauzy/contracts';
import { PaginationFilterBaseComponent } from '../../smart-data-layout/pagination/pagination-filter-base.component';
import * as i0 from "@angular/core";
export declare class RecordsHistoryComponent extends PaginationFilterBaseComponent implements OnInit, OnChanges {
    private readonly dialogRef?;
    /**
     * Which history to render.
     *
     * An `@Input()` so the component can be used INLINE (the dashboard-builder
     * widget) as well as through `NbDialogService`, which assigns the field
     * directly from its `context` and is unaffected by the decorator.
     */
    type: HistoryType;
    /** The rows to render; see {@link RecordsHistoryComponent.type} on the input. */
    records: IEmployeeStatisticsHistory[];
    smartTableSource: LocalDataSource;
    translatedType: string;
    loading: boolean;
    /** Guards {@link ngOnChanges} until the first population has happened in `ngOnInit`. */
    private _initialized;
    private _recordsHistory$;
    smartTableSettings: Object;
    constructor(translateService: TranslateService, dialogRef?: NbDialogRef<RecordsHistoryComponent>);
    /** True when this instance was opened as a dialog, i.e. when it can be closed. */
    get isDialog(): boolean;
    ngOnInit(): void;
    /**
     * Re-renders when the bound history changes.
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
    loadSettingsSmartTable(): void;
    /**
     * Gets the translated category name if it is one of the default categories;
     * otherwise, returns the original category name.
     *
     * @param category - The category name to be translated.
     * @returns The translated category name or the original category name if not a default category.
     */
    getCategoryName(category: string): string;
    _applyTranslationOnSmartTable(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecordsHistoryComponent, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecordsHistoryComponent, "ngx-records-history", never, { "type": { "alias": "type"; "required": false; }; "records": { "alias": "records"; "required": false; }; }, {}, never, never, false, never>;
}
