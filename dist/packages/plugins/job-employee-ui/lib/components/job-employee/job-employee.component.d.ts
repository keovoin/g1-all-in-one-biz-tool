import { AfterViewInit, OnInit, TemplateRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ID, IEmployee, IEmployeeJobsStatistics, IOrganization } from '@gauzy/contracts';
import { ServerDataSource, PageTabsetPageId, PageDataTablePageId } from '@gauzy/ui-core/core';
import { IRecordViewSection, PaginationFilterBaseComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
/**
 * Tab identifiers for the job employee page (Browse, Search, History).
 */
export declare enum JobSearchTabsEnum {
    BROWSE = "BROWSE",
    SEARCH = "SEARCH",
    HISTORY = "HISTORY"
}
/** Row shape served by `/employee-job/statistics`: the employee record enriched with its job counters. */
type JobEmployeeRow = IEmployee & Partial<IEmployeeJobsStatistics>;
/**
 * Job Employee Component
 *
 * Displays and manages job employees: browse list with statistics (available/applied jobs,
 * billing rates, job search status), pagination, and integration with the page tab and data table registries.
 */
export declare class JobEmployeeComponent extends PaginationFilterBaseComponent implements AfterViewInit, OnInit {
    /**
     * Stable permission array for `*ngxPermissionsOnly`.
     * 🛑 Never inline the literal in the binding: a new array on every change-detection
     * cycle makes ngx-permissions re-validate forever under default change detection,
     * which pins the main thread and the view never finishes rendering.
     */
    readonly permGateOrgJobEmployeeView: string[];
    /**
     * Stable permission array for `*ngxPermissionsOnly`.
     * 🛑 Never inline the literal in the binding: a new array on every change-detection
     * cycle makes ngx-permissions re-validate forever under default change detection,
     * which pins the main thread and the view never finishes rendering.
     */
    readonly permGateOrgJobEmployeeViewOrgEmployeesEdit: string[];
    private readonly _http;
    private readonly _route;
    private readonly _router;
    private readonly _ngxPermissionsService;
    private readonly _store;
    private readonly _employeesService;
    private readonly _jobSearchStoreService;
    private readonly _toastrService;
    private readonly _currencyPipe;
    private readonly _i18nService;
    private readonly _pageDataTableRegistryService;
    private readonly _pageTabRegistryService;
    private readonly _iconLibraries;
    readonly jobSearchTabsEnum: typeof JobSearchTabsEnum;
    readonly employees$: Subject<boolean>;
    readonly nbTab$: BehaviorSubject<JobSearchTabsEnum>;
    loading: boolean;
    settingsSmartTable: any;
    smartTableSource: ServerDataSource;
    organization: IOrganization | null;
    selectedEmployeeId: ID | null;
    selectedEmployee: IEmployee | null;
    disableButton: boolean;
    viewedEmployee: JobEmployeeRow | null;
    viewSections: IRecordViewSection[];
    readonly tabsetId: PageTabsetPageId;
    readonly dataTableId: PageDataTablePageId;
    readonly tableLayout: TemplateRef<any>;
    readonly comingSoon: TemplateRef<any>;
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly actionButtons: any;
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly visibleButton: any;
    constructor();
    /** Initialize permissions, locale, page tabs/columns, smart table settings, and translation listener. */
    ngOnInit(): void;
    /** Subscribe to employees$, pagination$, and store (organization + employee) to load and refresh job employees. */
    ngAfterViewInit(): void;
    /**
     * Initializes page elements by registering page tabs and data table columns
     * with the tab and data table registry services.
     */
    private _initializePageElements;
    /**
     * Registers the Browse, Search, and History tabs for the job employee tabset.
     *
     * @param _pageTabRegistryService - The PageTabRegistryService to register the tabs with.
     * @returns void
     */
    private registerPageTabs;
    /**
     * Registers data table columns (employee, available/applied jobs, billing rates, job search status).
     * @param _pageDataTableRegistryService - The PageDataTableRegistryService to register the columns with.
     * @returns void
     */
    private registerDataTableColumns;
    /**
     * Loads the current user's permissions into NgxPermissionsService.
     * @returns void
     */
    private _initializeUiPermissions;
    /**
     * Subscribes to preferred language and applies it via TranslateService.
     * @returns void
     */
    private _initializeUiLanguagesAndLocale;
    /**
     * Builds and assigns the Smart Table ServerDataSource for job employee statistics
     * (organization/tenant filter, optional employee filter, permission-based restrictions).
     */
    setSmartTableSource(): void;
    /**
     * Loads active job employees into the smart table and applies current pagination.
     * @returns void
     */
    getActiveJobEmployees(): Promise<void>;
    /**
     * Builds smart table settings (pager, columns from registry, edit actions, no-data message).
     * @returns void
     */
    private _loadSmartTableSettings;
    /**
     * Builds the inner markup for one of the table's row-action anchors.
     *
     * `editButtonContent` and its siblings take a STRING, which the library injects
     * with `[innerHTML]`, so an `<nb-icon>` written in there is never instantiated —
     * which is why these three anchors used to carry FontAwesome glyphs while every
     * other icon on the page came from the app's own pack. Reading the SVG straight
     * out of that pack closes the gap: `edit-outline` here draws exactly what
     * `<nb-icon icon="edit-outline">` draws in the toolbar above the table, and it
     * keeps drawing the same thing if the pack is ever re-pointed (it already maps
     * the Eva names to Tabler icons — see `TablerIconsModule`).
     *
     * @param icon - Icon name in the registered `eva` pack.
     * @param label - Translated accessible name for the action.
     * @returns The anchor's inner markup, or the bare label if the pack is unavailable.
     */
    private renderActionIcon;
    /**
     * Escapes a translated label for interpolation into the raw action markup above,
     * which is rendered with the sanitizer bypassed.
     *
     * @param value - The label to escape.
     * @returns The label with HTML-significant characters replaced by entities.
     */
    private escapeHtml;
    /**
     * Prepares the employee cell value (name, imageUrl, id) for the employee links column.
     * @param _ - The event object.
     * @param cell - The cell object.
     * @returns The employee cell value.
     */
    private prepareEmployeeValue;
    /**
     * Handles smart table edit confirm: updates employee bill rate and minimum billing rate, then refreshes the list.
     * @param event - The event object.
     * @returns void
     */
    onEditConfirm(event: any): Promise<void>;
    /**
     * Handles smart table edit cancel: refreshes the table to revert in-place changes.
     * @param event - The event object.
     * @returns void
     */
    onEditCancel(event: any): void;
    /** Re-applies smart table settings when the application language changes. */
    private _applyTranslationOnSmartTable;
    /**
     * Updates selected employee and edit button state when a row is selected or deselected.
     * @param isSelected - Whether the employee is selected.
     * @param data - The employee data.
     * @returns void
     */
    onSelectEmployee({ isSelected, data }: {
        isSelected: boolean;
        data: IEmployee;
    }): void;
    /**
     * Opens the read-only View of a job employee row in the right-side drawer.
     *
     * @param selectedItem - Row the action was invoked from, when it came from the grid.
     */
    view(selectedItem?: IEmployee): void;
    closeView(): void;
    /**
     * Field descriptor for the drawer — the grid columns, read vertically.
     * Derived cells (zero-defaulted job counters, currency-formatted rates) are
     * pre-computed here exactly as the grid's valuePrepareFunctions render them.
     */
    private buildViewSections;
    /**
     * Navigates to the employee edit page for the selected or given employee.
     * @param selectedItem - The employee to edit.
     * @returns void
     */
    edit(selectedItem?: IEmployee): void;
    /**
     * Navigates to the employees page with the add-dialog query param to open the add-employee dialog.
     * @param event - The mouse event that triggered the navigation.
     * @returns void
     */
    addNew(event?: MouseEvent): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobEmployeeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JobEmployeeComponent, "ga-job-employees", never, {}, {}, never, never, false, never>;
}
export {};
