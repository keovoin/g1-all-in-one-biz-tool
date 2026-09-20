import { OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService, NbThemeService, NbMenuItem, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IDateRangePicker, IEmployee, IOrganization, IOrganizationProject, ISelectedEmployee, IUser } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DateRangePickerBuilderService, EmployeeStore, EmployeesService, ISelectorVisibility, ISidebarActionConfig, LayoutService, NavigationBuilderService, OrganizationEditStore, OrganizationProjectStore, OrganizationProjectsService, OrganizationTeamStore, OrganizationTeamsService, OrganizationsService, SelectorBuilderService, Store, TimeTrackerService, UsersOrganizationsService } from '@gauzy/ui-core/core';
import { QuickActionsComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare class HeaderComponent extends TranslationBaseComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly sidebarService;
    private readonly layoutService;
    private readonly themeService;
    private readonly router;
    readonly translate: TranslateService;
    private readonly store;
    private readonly timeTrackerService;
    private readonly usersOrganizationsService;
    private readonly organizationsService;
    private readonly employeesService;
    private readonly organizationProjectsService;
    private readonly organizationTeamsService;
    readonly navigationBuilderService: NavigationBuilderService;
    private readonly dateRangeService;
    private readonly organizationEditStore;
    private readonly organizationProjectStore;
    private readonly organizationTeamStore;
    private readonly employeeStore;
    private readonly selectorBuilderService;
    private readonly cd;
    private readonly dialogService;
    isEmployee: boolean;
    isElectron: boolean;
    isDemo: boolean;
    position: string;
    user: IUser;
    employee: IEmployee;
    employee$: Observable<ISelectedEmployee>;
    project$: Observable<IOrganizationProject>;
    showEmployeesSelector: boolean;
    showOrganizationsSelector: boolean;
    showProjectsSelector: boolean;
    showTeamsSelector: boolean;
    showDateSelector: boolean;
    theme: string;
    createQuickActionsMenu: NbMenuItem[];
    showExtraActions: boolean;
    actions: {
        START_TIMER: string;
        STOP_TIMER: string;
    };
    timerDuration: string;
    organization: IOrganization;
    selectedDateRange: IDateRangePicker;
    subject$: Subject<any>;
    selectorsVisibility: ISelectorVisibility;
    isCollapse: boolean;
    expanded: boolean;
    private shortcutsMap;
    quickActionsRef: NbDialogRef<QuickActionsComponent> | null;
    defaultShortcuts: {
        quickActions: string;
        createInvoice: string;
        receivedInvoices: string;
        createEstimate: string;
        receivedEstimates: string;
        createPayment: string;
        createIncome: string;
        createExpense: string;
        createTeam: string;
        createTask: string;
        createProject: string;
        viewTasks: string;
        viewTeamTasks: string;
        addEmployee: string;
        addInventory: string;
        addEquipment: string;
        addVendor: string;
        addDepartment: string;
        timeLog: string;
        viewAppointments: string;
        viewTimeActivity: string;
        startTimer: string;
        stopTimer: string;
        createCandidate: string;
        createProposal: string;
        createContract: string;
        createLead: string;
        createCustomer: string;
        createClient: string;
        viewClients: string;
    };
    constructor(sidebarService: NbSidebarService, layoutService: LayoutService, themeService: NbThemeService, router: Router, translate: TranslateService, store: Store, timeTrackerService: TimeTrackerService, usersOrganizationsService: UsersOrganizationsService, organizationsService: OrganizationsService, employeesService: EmployeesService, organizationProjectsService: OrganizationProjectsService, organizationTeamsService: OrganizationTeamsService, navigationBuilderService: NavigationBuilderService, dateRangeService: DateRangePickerBuilderService, organizationEditStore: OrganizationEditStore, organizationProjectStore: OrganizationProjectStore, organizationTeamStore: OrganizationTeamStore, employeeStore: EmployeeStore, selectorBuilderService: SelectorBuilderService, cd: ChangeDetectorRef, dialogService: NbDialogService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Setup shortcuts
     */
    private setupShortcuts;
    /**
     * Pressed keys to string
     *
     * @param handler
     * @returns
     */
    private pressedKeysToString;
    /**
     * Register shortcut
     * @param keys
     * @param action
     */
    private registerShortcut;
    /**
     * Register default shortcuts
     */
    private registerDefaultShortcuts;
    /**
     * Toggles the quick actions dialog, opening it if it's not open, and closing it if it's already open.
     */
    private toggleQuickActionsDialog;
    /**
     *
     * @param value
     * @returns
     */
    private formatShortcut;
    /**
     * Navigate to
     *
     * @param action
     */
    private navigateTo;
    /**
     * Open quick actions
     */
    openQuickActions(): void;
    /**
     * Check project selector visibility
     *
     * @returns
     */
    checkProjectSelectorVisibility(): Promise<void>;
    /**
     * Check Team selector visibility
     *
     * @returns
     */
    checkTeamSelectorVisibility(): Promise<void>;
    /**
     * Check employee selector visibility
     *
     * @returns
     */
    checkEmployeeSelectorVisibility(): Promise<void>;
    /**
     * Check organization selector visibility
     */
    checkOrganizationSelectorVisibility(): Promise<void>;
    /**
     * Toggle timer window
     */
    toggleTimerWindow(): void;
    /**
     * Toggle sidebar actions
     * @param item
     */
    toggleSidebarActions(item: ISidebarActionConfig): void;
    /**
     * Toggle sidebar
     * @returns
     */
    toggleSidebar(): boolean;
    /**
     * Navigate home
     * @returns
     */
    navigateHome(): boolean;
    /**
     *
     * @param event
     */
    closeExtraActionsIfLarge(event?: any): void;
    /**
     * Toggle extra actions
     * @param bool
     */
    toggleExtraActions(bool?: boolean): void;
    /**
     * Load context menus
     */
    private _loadContextMenus;
    /**
     * Apply translation on context menu
     */
    private _applyTranslationOnContextMenu;
    /**
     * Checks the timer status if time tracking is enabled.
     */
    private _checkTimerStatus;
    /**
     * Checks if web timer is enabled.
     * @returns {boolean} - True if web timer is enabled, false otherwise.
     */
    isEnabledTimeTracking(): boolean;
    /**
     * On collapse
     * @param event
     */
    onCollapse(event: boolean): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HeaderComponent, "ngx-header", never, { "position": { "alias": "position"; "required": false; }; "expanded": { "alias": "expanded"; "required": false; }; }, {}, never, never, false, never>;
}
