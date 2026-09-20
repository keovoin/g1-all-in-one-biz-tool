import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NbSidebarService, NbThemeService, NbDialogService } from '@nebular/theme';
import { combineLatest, firstValueFrom, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import hotkeys from 'hotkeys-js';
import { CrudActionEnum, FeatureEnum, PermissionsEnum, TimeLogSourceEnum, TimeLogType } from '@gauzy/contracts';
import { environment } from '@gauzy/ui-config';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { DEFAULT_SELECTOR_VISIBILITY, DateRangePickerBuilderService, EmployeeStore, EmployeesService, LayoutService, NavigationBuilderService, OrganizationEditStore, OrganizationProjectStore, OrganizationProjectsService, OrganizationTeamStore, OrganizationTeamsService, OrganizationsService, SelectorBuilderService, Store, TimeTrackerService, UsersOrganizationsService } from '@gauzy/ui-core/core';
import { ALL_EMPLOYEES_SELECTED, NO_EMPLOYEE_SELECTED, QuickActionsComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/router";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "ngx-permissions";
import * as i7 from "@angular/common";
let HeaderComponent = class HeaderComponent extends TranslationBaseComponent {
    constructor(sidebarService, layoutService, themeService, router, translate, store, timeTrackerService, usersOrganizationsService, organizationsService, employeesService, organizationProjectsService, organizationTeamsService, navigationBuilderService, dateRangeService, organizationEditStore, organizationProjectStore, organizationTeamStore, employeeStore, selectorBuilderService, cd, dialogService) {
        super(translate);
        this.sidebarService = sidebarService;
        this.layoutService = layoutService;
        this.themeService = themeService;
        this.router = router;
        this.translate = translate;
        this.store = store;
        this.timeTrackerService = timeTrackerService;
        this.usersOrganizationsService = usersOrganizationsService;
        this.organizationsService = organizationsService;
        this.employeesService = employeesService;
        this.organizationProjectsService = organizationProjectsService;
        this.organizationTeamsService = organizationTeamsService;
        this.navigationBuilderService = navigationBuilderService;
        this.dateRangeService = dateRangeService;
        this.organizationEditStore = organizationEditStore;
        this.organizationProjectStore = organizationProjectStore;
        this.organizationTeamStore = organizationTeamStore;
        this.employeeStore = employeeStore;
        this.selectorBuilderService = selectorBuilderService;
        this.cd = cd;
        this.dialogService = dialogService;
        this.isEmployee = false;
        this.isElectron = environment.IS_ELECTRON;
        this.isDemo = environment.DEMO;
        this.position = 'normal';
        this.employee$ = this.store.selectedEmployee$;
        this.project$ = this.store.selectedProject$;
        this.showDateSelector = true;
        this.showExtraActions = false;
        this.actions = {
            START_TIMER: 'START_TIMER',
            STOP_TIMER: 'STOP_TIMER'
        };
        this.subject$ = new Subject();
        this.isCollapse = true;
        this.expanded = true;
        this.shortcutsMap = new Map();
        this.defaultShortcuts = {
            quickActions: 'ctrl+Q',
            createInvoice: 'I',
            receivedInvoices: 'shift+I',
            createEstimate: 'E',
            receivedEstimates: 'shift+E',
            createPayment: 'P',
            createIncome: 'C',
            createExpense: 'X',
            createTeam: 'G',
            createTask: 'T',
            createProject: 'J',
            viewTasks: 'shift+T',
            viewTeamTasks: 'shift+G',
            addEmployee: 'A+E',
            addInventory: 'A+I',
            addEquipment: 'A+Q',
            addVendor: 'A+V',
            addDepartment: 'A+D',
            timeLog: 'shift+L',
            viewAppointments: 'shift+A',
            viewTimeActivity: 'shift+S',
            startTimer: 'S',
            stopTimer: 'O',
            createCandidate: 'U',
            createProposal: 'R',
            createContract: 'K',
            createLead: 'D',
            createCustomer: 'M',
            createClient: 'N',
            viewClients: 'shift+N'
        };
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(1300), tap(() => this.checkEmployeeSelectorVisibility()), tap(() => this.checkProjectSelectorVisibility()), tap(() => this.checkTeamSelectorVisibility()), tap(() => this._loadContextMenus()), untilDestroyed(this))
            .subscribe();
        this.selectorBuilderService.selectors$
            .pipe(distinctUntilChange(), debounceTime(200), tap((selectors) => {
            this.selectorsVisibility = Object.assign({}, DEFAULT_SELECTOR_VISIBILITY, selectors);
        }), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd), tap(() => (this.timeTrackerService.showTimerWindow = false)), untilDestroyed(this))
            .subscribe();
        this.timeTrackerService.duration$.pipe(untilDestroyed(this)).subscribe((time) => {
            if (!isNaN(time)) {
                this.timerDuration = moment.utc(time * 1000).format('HH:mm:ss');
            }
        });
        this.store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap((user) => (this.employee = user?.employee)), tap((user) => (this.isEmployee = !!user && !!user.employee?.id)), untilDestroyed(this))
            .subscribe(async () => {
            //check header selectors dropdown permissions
            await this.checkOrganizationSelectorVisibility();
            //check timer status for employee
            if (this.isEmployee) {
                this._checkTimerStatus();
            }
        });
        const storeOrganization$ = this.store.selectedOrganization$;
        const selectedDateRange$ = this.dateRangeService.selectedDateRange$;
        combineLatest([storeOrganization$, selectedDateRange$])
            .pipe(filter(([organization]) => !!organization), untilDestroyed(this))
            .subscribe(([organization, dateRange]) => {
            this.organization = organization;
            this.selectedDateRange = dateRange;
            this.subject$.next(true);
        });
        this._applyTranslationOnContextMenu();
        this._loadContextMenus();
        // -- setup shortcuts keyboards
        this.setupShortcuts();
    }
    ngAfterViewInit() {
        this.themeService
            .onThemeChange()
            .pipe(tap((theme) => {
            this.theme = theme.name;
            this.cd.detectChanges();
        }), untilDestroyed(this))
            .subscribe();
        this.organizationEditStore.organizationAction$
            .pipe(filter(({ action, organization }) => !!action && !!organization), tap(() => this.organizationEditStore.destroy()), untilDestroyed(this))
            .subscribe(({ action }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                case CrudActionEnum.UPDATED:
                case CrudActionEnum.DELETED:
                    this.checkOrganizationSelectorVisibility();
                    break;
            }
        });
        this.organizationTeamStore.organizationTeamAction$
            .pipe(filter(({ action, team }) => !!action && !!team), tap(() => this.organizationTeamStore.destroy()), untilDestroyed(this))
            .subscribe(({ action }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                case CrudActionEnum.UPDATED:
                case CrudActionEnum.DELETED:
                    this.checkTeamSelectorVisibility();
                    break;
            }
        });
        this.organizationProjectStore.organizationProjectAction$
            .pipe(filter(({ action, project }) => !!action && !!project), tap(() => this.organizationProjectStore.destroy()), untilDestroyed(this))
            .subscribe(({ action }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                case CrudActionEnum.UPDATED:
                case CrudActionEnum.DELETED:
                    this.checkProjectSelectorVisibility();
                    break;
            }
        });
        this.employeeStore.employeeAction$
            .pipe(filter(({ action, employees }) => !!action && !!employees), tap(() => this.employeeStore.destroy()), untilDestroyed(this))
            .subscribe(({ action }) => {
            switch (action) {
                case CrudActionEnum.CREATED:
                case CrudActionEnum.UPDATED:
                case CrudActionEnum.DELETED:
                    this.checkEmployeeSelectorVisibility();
                    break;
            }
        });
        this.cd.detectChanges();
    }
    /**
     * Setup shortcuts
     */
    setupShortcuts() {
        // -- register the default shortcuts
        this.registerDefaultShortcuts();
        hotkeys('*', {
            scope: 'defaultShortcuts'
        }, (event, handler) => {
            const pressedKeys = this.pressedKeysToString(handler);
            // -- prevent triggering shortcuts when typing in NbOptions (searchable inputs)
            if (event.target.localName === 'nb-option')
                return;
            if (this.shortcutsMap.has(pressedKeys)) {
                // -- close dialog if open when using shortcuts and prevent closing dialog by pressing unregistered keys
                this.quickActionsRef &&
                    pressedKeys !== this.defaultShortcuts.quickActions.toLowerCase() &&
                    this.shortcutsMap.has(pressedKeys)
                    ? this.quickActionsRef.close()
                    : null;
                if (handler.scope === 'defaultShortcuts' && this.shortcutsMap.has(pressedKeys)) {
                    this.shortcutsMap.get(pressedKeys)();
                }
            }
        });
    }
    /**
     * Pressed keys to string
     *
     * @param handler
     * @returns
     */
    pressedKeysToString(handler) {
        return handler.keys
            .map((keyNum) => {
            return hotkeys.modifierMap[keyNum]
                ? hotkeys.modifierMap[keyNum].toString().replace('Key', '')
                : String.fromCharCode(keyNum).toLowerCase();
        })
            .join('+');
    }
    /**
     * Register shortcut
     * @param keys
     * @param action
     */
    registerShortcut(keys, action) {
        this.shortcutsMap.set(keys.toLowerCase(), action);
        hotkeys(keys, 'defaultShortcuts', () => { });
        hotkeys.setScope('defaultShortcuts');
    }
    /**
     * Register default shortcuts
     */
    registerDefaultShortcuts() {
        // -- Toggle QuickActions Dialog
        this.registerShortcut(this.defaultShortcuts.quickActions, () => this.toggleQuickActionsDialog());
        // -- Accounting
        this.registerShortcut(this.defaultShortcuts.createInvoice, () => this.navigateTo('createInvoice'));
        this.registerShortcut(this.defaultShortcuts.receivedInvoices, () => this.navigateTo('receivedInvoices'));
        this.registerShortcut(this.defaultShortcuts.createIncome, () => this.navigateTo('createIncome'));
        this.registerShortcut(this.defaultShortcuts.receivedEstimates, () => this.navigateTo('receivedEstimates'));
        this.registerShortcut(this.defaultShortcuts.createExpense, () => this.navigateTo('createExpense'));
        this.registerShortcut(this.defaultShortcuts.createEstimate, () => this.navigateTo('createEstimate'));
        this.registerShortcut(this.defaultShortcuts.createPayment, () => this.navigateTo('createPayment'));
        // -- project management
        this.registerShortcut(this.defaultShortcuts.createTeam, () => this.navigateTo('createTeam'));
        this.registerShortcut(this.defaultShortcuts.createTask, () => this.navigateTo('createTask'));
        this.registerShortcut(this.defaultShortcuts.createProject, () => this.navigateTo('createProject'));
        this.registerShortcut(this.defaultShortcuts.viewTasks, () => this.navigateTo('viewTasks'));
        this.registerShortcut(this.defaultShortcuts.viewTeamTasks, () => this.navigateTo('viewTeamTasks'));
        // -- Organization
        this.registerShortcut(this.defaultShortcuts.addEmployee, () => this.navigateTo('addEmployee'));
        this.registerShortcut(this.defaultShortcuts.addInventory, () => this.navigateTo('addInventory'));
        this.registerShortcut(this.defaultShortcuts.addEquipment, () => this.navigateTo('addEquipment'));
        this.registerShortcut(this.defaultShortcuts.addVendor, () => this.navigateTo('addVendor'));
        this.registerShortcut(this.defaultShortcuts.addDepartment, () => this.navigateTo('addDepartment'));
        // -- Jobs
        this.registerShortcut(this.defaultShortcuts.createCandidate, () => this.navigateTo('createCandidate'));
        this.registerShortcut(this.defaultShortcuts.createProposal, () => this.navigateTo('createProposal'));
        this.registerShortcut(this.defaultShortcuts.createContract, () => this.navigateTo('createContract'));
        // -- contact
        this.registerShortcut(this.defaultShortcuts.createLead, () => this.navigateTo('createLead'));
        this.registerShortcut(this.defaultShortcuts.createCustomer, () => this.navigateTo('createCustomer'));
        this.registerShortcut(this.defaultShortcuts.createClient, () => this.navigateTo('createClient'));
        this.registerShortcut(this.defaultShortcuts.viewClients, () => this.navigateTo('viewClients'));
        // -- Time Tracking
        this.registerShortcut(this.defaultShortcuts.timeLog, () => this.navigateTo('timeLog'));
        this.registerShortcut(this.defaultShortcuts.viewAppointments, () => this.navigateTo('viewAppointments'));
        this.registerShortcut(this.defaultShortcuts.viewTimeActivity, () => this.navigateTo('viewTimeActivity'));
        // -- Start timer
        this.registerShortcut(this.defaultShortcuts.startTimer, () => {
            if (this.timeTrackerService.running)
                return;
            this.timeTrackerService.setTimeLogType(TimeLogType.TRACKED);
            this.timeTrackerService.openAndStartTimer();
        });
        // -- Stop timer
        this.registerShortcut(this.defaultShortcuts.stopTimer, async () => {
            if (this.timeTrackerService.running)
                await this.timeTrackerService.toggle();
        });
    }
    /**
     * Toggles the quick actions dialog, opening it if it's not open, and closing it if it's already open.
     */
    toggleQuickActionsDialog() {
        if (!this.quickActionsRef) {
            this.openQuickActions();
        }
        else {
            this.quickActionsRef.close();
        }
    }
    /**
     *
     * @param value
     * @returns
     */
    formatShortcut(value) {
        return value
            .split('+')
            .map((key) => key.toUpperCase())
            .join(' + ');
    }
    /**
     * Navigate to
     *
     * @param action
     */
    navigateTo(action) {
        const itemMenu = this.createQuickActionsMenu.find((item) => item?.data?.action === action);
        itemMenu ? this.router.navigate([itemMenu.link], { queryParams: { ...itemMenu.queryParams } }) : null;
    }
    /**
     * Open quick actions
     */
    openQuickActions() {
        this.quickActionsRef = this.dialogService.open(QuickActionsComponent, {
            context: {
                items: this.createQuickActionsMenu,
                shortcutDialog: this.defaultShortcuts.quickActions
            }
        });
        // -- subscribe to reset (quickActionsRef) to null onDialogClose
        this.quickActionsRef?.onClose.subscribe(() => {
            this.quickActionsRef = null;
        });
    }
    /**
     * Check project selector visibility
     *
     * @returns
     */
    async checkProjectSelectorVisibility() {
        // Hidden project selector if not activate for current page
        if (!this.organization ||
            !this.selectorsVisibility.project ||
            !this.store.hasAnyPermission(PermissionsEnum.ALL_ORG_VIEW, PermissionsEnum.ORG_PROJECT_VIEW)) {
            return;
        }
        // Extract organization and tenant IDs
        const { id: organizationId, tenantId } = this.organization;
        // Include member if employeeId or store user's employeeId is provided
        const employeeId = this.store.user.employee?.id || this.store.selectedEmployee?.id;
        // Get project count
        const count = await this.organizationProjectsService.getCount({
            organizationId,
            tenantId,
            ...(employeeId && { members: { employeeId } })
        });
        //	Show project selector if count > 0
        this.showProjectsSelector = count > 0;
    }
    /**
     * Check Team selector visibility
     *
     * @returns
     */
    async checkTeamSelectorVisibility() {
        // hidden team selector if not activate for current page
        if (!this.organization ||
            !this.selectorsVisibility.team ||
            !this.store.hasAnyPermission(PermissionsEnum.ALL_ORG_VIEW, PermissionsEnum.ORG_TEAM_VIEW)) {
            return;
        }
        // Extract organization and tenant IDs
        const { id: organizationId, tenantId } = this.organization;
        // Include member if employeeId or store user's employeeId is provided
        const employeeId = this.store.user.employee?.id || this.store.selectedEmployee?.id;
        // Get team count
        const count = await this.organizationTeamsService.getCount({
            organizationId,
            tenantId,
            ...(employeeId && { members: { employeeId } })
        });
        // Show team selector if count > 0
        this.showTeamsSelector = count > 0;
    }
    /**
     * Check employee selector visibility
     *
     * @returns
     */
    async checkEmployeeSelectorVisibility() {
        // hidden employee selector if not activate for current page
        if (!this.organization || !this.selectorsVisibility.employee) {
            return;
        }
        if (this.store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            const { id: organizationId, tenantId } = this.organization;
            // Get employee count
            const { total: employeeCount } = await this.employeesService.getWorkingCount(organizationId, tenantId, this.selectedDateRange);
            // If employee count > 0, show employees selector
            this.showEmployeesSelector = employeeCount > 0;
            // If no employee selected and employee count > 0, set selected employee to ALL_EMPLOYEES_SELECTED
            if (this.showEmployeesSelector && !this.store.selectedEmployee) {
                this.store.selectedEmployee = ALL_EMPLOYEES_SELECTED;
            }
        }
        else {
            // If employee is not selected, get the first employee
            if (this.isEmployee) {
                const { id: employeeId } = this.user.employee;
                if (employeeId) {
                    // Get employee by ID
                    const employee = await firstValueFrom(this.employeesService.getEmployeeById(employeeId));
                    // If employee found, set selected employee
                    if (isNotEmpty(employee)) {
                        this.store.selectedEmployee = {
                            id: employee.id,
                            firstName: this.user.firstName,
                            lastName: this.user.lastName,
                            fullName: this.user.name,
                            imageUrl: this.user.imageUrl
                        };
                    }
                    else {
                        this.store.selectedEmployee = NO_EMPLOYEE_SELECTED;
                    }
                }
                else {
                    this.store.selectedEmployee = NO_EMPLOYEE_SELECTED;
                }
            }
        }
    }
    /**
     * Check organization selector visibility
     */
    async checkOrganizationSelectorVisibility() {
        const { id: userId, tenantId } = this.store.user;
        // Count user organizations based on the provided userId and tenantId
        const orgCount = await this.usersOrganizationsService.getCount({ userId, tenantId });
        // Check if the current user has the permission to change the selected organization
        const hasChangeSelectedOrganizationPermission = this.store.hasPermission(PermissionsEnum.CHANGE_SELECTED_ORGANIZATION);
        // Show organization selector only if user has permission and more than 1 organization exists
        this.showOrganizationsSelector = hasChangeSelectedOrganizationPermission && orgCount > 1;
        // If organization selector is not shown and the user has at least one organization
        if (!this.showOrganizationsSelector && orgCount > 0) {
            try {
                // Retrieve user organizations
                const { items: userOrg } = await this.usersOrganizationsService.getAll([], {
                    userId,
                    tenantId
                });
                // If organizations exist, set the first one into local storage
                if (userOrg.length > 0) {
                    const [firstUserOrg] = userOrg;
                    // Retrieve organization details for the employee
                    const organization = await firstValueFrom(this.organizationsService.getById(firstUserOrg.organizationId, ['contact']));
                    // Set the selected organization in local storage
                    this.store.selectedOrganization = organization;
                }
            }
            catch (error) {
                console.error('Error retrieving user organizations or organization details:', error);
            }
        }
    }
    /**
     * Toggle timer window
     */
    toggleTimerWindow() {
        this.timeTrackerService.showTimerWindow = !this.timeTrackerService.showTimerWindow;
    }
    /**
     * Toggle sidebar actions
     * @param item
     */
    toggleSidebarActions(item) {
        const sidebar = this.navigationBuilderService.getSidebarById(item.id);
        if (this.showExtraActions) {
            this.toggleExtraActions(false);
            this.sidebarService.expand(sidebar.id);
        }
        else {
            this.sidebarService.toggle(false, sidebar.id);
        }
    }
    /**
     * Toggle sidebar
     * @returns
     */
    toggleSidebar() {
        if (this.showExtraActions) {
            this.toggleExtraActions(false);
            this.sidebarService.expand('menu-sidebar');
        }
        else {
            this.sidebarService.toggle(true, 'menu-sidebar');
            this.layoutService.changeLayoutSize();
        }
        return false;
    }
    /**
     * Navigate home
     * @returns
     */
    navigateHome() {
        //this.menuService.navigateHome();
        return false;
    }
    /**
     *
     * @param event
     */
    closeExtraActionsIfLarge(event) {
        let width;
        if (event !== undefined) {
            width = event.target.innerWidth;
        }
        else {
            width = document.body.clientWidth;
        }
        if (width >= 1200) {
            this.showExtraActions = false;
        }
    }
    /**
     * Toggle extra actions
     * @param bool
     */
    toggleExtraActions(bool) {
        this.showExtraActions = bool !== undefined ? bool : !this.showExtraActions;
    }
    /**
     * Load context menus
     */
    _loadContextMenus() {
        // The support menu (Support Chat / FAQ / Help / About) was built here and
        // rendered by the speech-bubble header action. It now lives in the Quick
        // Settings panel, see ThemeSettingsComponent.
        this.createQuickActionsMenu = [
            // Divider (Accounting)
            ...(this.store.hasAnyPermission(PermissionsEnum.INVOICES_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_INVOICE'),
                        icon: 'file-text-outline',
                        link: 'pages/accounting/invoices/add',
                        data: {
                            action: 'createInvoice'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createInvoice),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(!!this.user.employee
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.RECEIVED_INVOICES'),
                        icon: {
                            icon: 'file-invoice-dollar',
                            pack: 'font-awesome'
                        },
                        link: 'pages/accounting/invoices/received-invoices',
                        data: {
                            action: 'receivedInvoices'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.receivedInvoices),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_INCOMES_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_INCOME'),
                        icon: 'plus-circle-outline',
                        link: 'pages/accounting/income',
                        data: {
                            action: 'createIncome'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createIncome),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_EXPENSES_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_EXPENSE'),
                        icon: 'minus-circle-outline',
                        link: 'pages/accounting/expenses',
                        data: {
                            action: 'createExpense'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createExpense),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ESTIMATES_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_ESTIMATE'),
                        icon: 'file-outline',
                        link: 'pages/accounting/invoices/estimates/add',
                        data: {
                            action: 'createEstimate'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createEstimate),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(!!this.user.employee
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.RECEIVED_ESTIMATES'),
                        icon: {
                            icon: 'file-invoice',
                            pack: 'font-awesome'
                        },
                        link: 'pages/accounting/invoices/received-estimates',
                        data: {
                            action: 'receivedEstimates'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.receivedEstimates),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_PAYMENT_ADD_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_PAYMENT'),
                        icon: 'credit-card-outline',
                        link: 'pages/accounting/payments',
                        data: {
                            action: 'createPayment'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createPayment),
                            status: 'control'
                        }
                    }
                ]
                : []),
            // Divider (Organization)
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_EMPLOYEES_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.ADD_EMPLOYEE'),
                        icon: 'people-outline',
                        link: 'pages/employees',
                        data: {
                            action: 'addEmployee'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.addEmployee),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.ADD_INVENTORY'),
                        icon: 'inbox-outline',
                        link: 'pages/organization/inventory/create',
                        data: {
                            action: 'addInventory'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.addInventory),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_EQUIPMENT_EDIT, PermissionsEnum.ALL_ORG_EDIT) ||
                !!this.user.employee
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.ADD_EQUIPMENT'),
                        icon: 'pantone-outline',
                        link: 'pages/organization/equipment',
                        data: {
                            action: 'addEquipment'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.addEquipment),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.ADD_VENDOR'),
                        icon: 'car-outline',
                        link: 'pages/organization/vendors',
                        data: {
                            action: 'addVendor'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.addVendor),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.ADD_DEPARTMENT'),
                        icon: 'briefcase-outline',
                        link: 'pages/organization/departments',
                        data: {
                            action: 'addDepartment'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.addDepartment),
                            status: 'control'
                        }
                    }
                ]
                : []),
            // Divider (Project Management)
            ...(this.store.hasAnyPermission(PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_TEAM'),
                        icon: 'people-outline',
                        link: 'pages/organization/teams',
                        data: {
                            action: 'createTeam'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createTeam),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasPermission(PermissionsEnum.ORG_TASK_ADD)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_TASK'),
                        icon: 'archive-outline',
                        link: 'pages/tasks/dashboard',
                        data: {
                            action: 'createTask'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createTask),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_PROJECT_ADD, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_PROJECT'),
                        icon: 'color-palette-outline',
                        link: 'pages/organization/projects/create',
                        data: {
                            action: 'createProject'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createProject),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_TASK_VIEW, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.VIEW_TASKS'),
                        icon: 'calendar-outline',
                        link: 'pages/tasks/dashboard',
                        data: {
                            action: 'viewTasks'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.viewTasks),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_TASK_VIEW, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.VIEW_TEAM_TASKS'),
                        icon: 'layers-outline',
                        link: 'pages/tasks/team',
                        data: {
                            action: 'viewTeamTasks'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.viewTeamTasks),
                            status: 'control'
                        }
                    }
                ]
                : []),
            // Divider (Jobs)
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_CANDIDATES_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_CANDIDATE'),
                        icon: 'person-add-outline',
                        link: 'pages/employees/candidates',
                        data: {
                            action: 'createCandidate'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createCandidate),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_PROPOSALS_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_PROPOSAL'),
                        icon: 'paper-plane-outline',
                        link: 'pages/sales/proposals/register',
                        data: {
                            action: 'createProposal'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createProposal),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_CONTRACT_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_CONTRACT'),
                        icon: 'file-text-outline',
                        link: 'pages/integrations/upwork',
                        data: {
                            action: 'createContract'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createContract),
                            status: 'control'
                        }
                    }
                ]
                : []),
            // Divider (Contacts)
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_CONTACT_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_LEAD'),
                        icon: 'shield-outline',
                        link: 'pages/contacts/leads',
                        data: {
                            action: 'createLead'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createLead),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_CONTACT_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_CUSTOMER'),
                        icon: 'person-done-outline',
                        link: 'pages/contacts/customers',
                        data: {
                            action: 'createCustomer'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createCustomer),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.ORG_CONTACT_EDIT, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.CREATE_CLIENT'),
                        icon: 'person-outline',
                        link: 'pages/contacts/clients',
                        data: {
                            action: 'createClient'
                        },
                        queryParams: {
                            openAddDialog: true
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.createClient),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(!!this.user.employee
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.VIEW_CLIENTS'),
                        icon: 'person-outline',
                        link: 'pages/contacts/clients',
                        data: {
                            action: 'viewClients'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.viewClients),
                            status: 'control'
                        }
                    }
                ]
                : []),
            // Divider (Time Tracking)
            ...(this.store.hasAnyPermission(PermissionsEnum.TIMESHEET_EDIT_TIME, PermissionsEnum.ALL_ORG_EDIT)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.TIME_LOG'),
                        icon: 'clock-outline',
                        link: 'pages/employees/timesheets/daily',
                        data: {
                            action: 'timeLog'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.timeLog),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.TIME_TRACKER)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.VIEW_APPOINTMENTS'),
                        icon: 'calendar-outline',
                        link: 'pages/employees/appointments',
                        data: {
                            action: 'viewAppointments'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.viewAppointments),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(this.store.hasAnyPermission(PermissionsEnum.TIME_TRACKER)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.VIEW_TIME_ACTIVITY'),
                        icon: 'activity-outline',
                        link: 'pages/employees/activity/time-activities',
                        data: {
                            action: 'viewTimeActivity'
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.viewTimeActivity),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(!!this.user.employee
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.START_TIMER'),
                        icon: 'play-circle-outline',
                        hidden: !this.isEmployee || this.isElectron,
                        data: {
                            action: this.actions.START_TIMER // -- Start the timer
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.startTimer),
                            status: 'control'
                        }
                    }
                ]
                : []),
            ...(!this.store.hasAnyPermission(PermissionsEnum.TIMESHEET_EDIT_TIME)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.STOP_TIMER'),
                        icon: 'pause-circle-outline',
                        hidden: !this.isEmployee || this.isElectron,
                        data: {
                            action: this.actions.STOP_TIMER // -- Stop the timer
                        },
                        badge: {
                            text: this.formatShortcut(this.defaultShortcuts.stopTimer),
                            status: 'control'
                        }
                    }
                ]
                : []),
            // Divider (Documents) — `@gauzy/plugin-docs-ui`, `01-ux-spec.md` §1. Both entries
            // are one-shot deep links the hub consumes and strips from the URL on arrival.
            // The hub's own route guards re-check the feature flag, but relying on that alone
            // left a feature-disabled org staring at two live menu entries that bounce straight
            // back to the dashboard — so the flag is checked here too. `_loadContextMenus()`
            // already re-runs on organization change, which is when the flag can flip.
            ...(this.store.hasPermission(PermissionsEnum.DOCS_CREATE) &&
                this.store.hasFeatureEnabled(FeatureEnum.FEATURE_DOCUMENTS)
                ? [
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.DOCUMENTS.NEW_PAGE'),
                        icon: 'file-add-outline',
                        link: 'pages/documents',
                        queryParams: {
                            newPage: 1
                        },
                        data: {
                            action: 'newDocumentPage'
                        }
                    },
                    {
                        title: this.getTranslation('QUICK_ACTIONS_MENU.DOCUMENTS.UPLOAD'),
                        icon: 'upload-outline',
                        link: 'pages/documents',
                        queryParams: {
                            upload: 1
                        },
                        data: {
                            action: 'uploadDocuments'
                        }
                    }
                ]
                : [])
        ];
    }
    /**
     * Apply translation on context menu
     */
    _applyTranslationOnContextMenu() {
        this.translate.onLangChange
            .pipe(tap(() => {
            // this.createContextMenu = [];
            this.createQuickActionsMenu = [];
            this._loadContextMenus();
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Checks the timer status if time tracking is enabled.
     */
    async _checkTimerStatus() {
        if (!this.organization || !this.isEnabledTimeTracking()) {
            return;
        }
        const { id: organizationId, tenantId } = this.organization;
        const { id: employeeId } = this.employee;
        // Check timer status using the TimeTrackerService
        await this.timeTrackerService.checkTimerStatus({
            organizationId,
            tenantId,
            employeeId,
            source: TimeLogSourceEnum.WEB_TIMER
        });
    }
    /**
     * Checks if web timer is enabled.
     * @returns {boolean} - True if web timer is enabled, false otherwise.
     */
    isEnabledTimeTracking() {
        const { employee, store, isElectron } = this;
        const isTrackingEnabled = employee?.id && employee?.isTrackingEnabled;
        const hasPermission = store.hasPermission(PermissionsEnum.TIME_TRACKER);
        return isTrackingEnabled && hasPermission && !isElectron;
    }
    /**
     * On collapse
     * @param event
     */
    onCollapse(event) {
        this.isCollapse = event;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HeaderComponent, deps: [{ token: i1.NbSidebarService }, { token: i2.LayoutService }, { token: i1.NbThemeService }, { token: i3.Router }, { token: i4.TranslateService }, { token: i2.Store }, { token: i2.TimeTrackerService }, { token: i2.UsersOrganizationsService }, { token: i2.OrganizationsService }, { token: i2.EmployeesService }, { token: i2.OrganizationProjectsService }, { token: i2.OrganizationTeamsService }, { token: i2.NavigationBuilderService }, { token: i2.DateRangePickerBuilderService }, { token: i2.OrganizationEditStore }, { token: i2.OrganizationProjectStore }, { token: i2.OrganizationTeamStore }, { token: i2.EmployeeStore }, { token: i2.SelectorBuilderService }, { token: i0.ChangeDetectorRef }, { token: i1.NbDialogService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: HeaderComponent, isStandalone: false, selector: "ngx-header", inputs: { position: "position", expanded: "expanded" }, usesInheritance: true, ngImport: i0, template: "@if (isDemo) {\n  <div class=\"notification-header\">\n    You are using a demo account. Finding our software useful?\n    <a href=\"/auth/register\"> Click here to Sign Up and start using for free! </a>\n  </div>\n}\n<div class=\"main-header\">\n  <!-- The breadcrumb trail used to live here. It now renders under the page\n       title (ngx-header-title): the header band is already dense with\n       selectors, and the trail was being squeezed to nothing on pages that\n       show every selector. -->\n  @if (createQuickActionsMenu?.length > 0) {\n    <div class=\"header-lead\">\n      <nb-action\n        size=\"small\"\n        [class.left]=\"position === 'normal'\"\n        [class.right]=\"position === 'inverse'\"\n        class=\"show-large-up\"\n        >\n        <button type=\"button\" nbButton class=\"button create\" status=\"primary\" size=\"small\" (click)=\"openQuickActions()\">\n          + {{ 'BUTTONS.CREATE' | translate }}\n        </button>\n      </nb-action>\n    </div>\n  }\n  <div class=\"header-container\">\n    <div class=\"actions\" size=\"small\" [class.left]=\"position === 'normal'\" [class.right]=\"position === 'inverse'\">\n      @if (showTeamsSelector && !showExtraActions && selectorsVisibility?.team) {\n        <nb-action\n          class=\"show-large-up\"\n          >\n          <ga-team-selector\n            dropdownClass=\"header-entity-select\"\n            [employeeId]=\"(employee$ | async)?.id\"\n            [projectId]=\"(project$ | async)?.id\"\n            [shortened]=\"true\"\n            class=\"header-selector team-selector\"\n          ></ga-team-selector>\n        </nb-action>\n      }\n\n      @if (showProjectsSelector && !showExtraActions && selectorsVisibility?.project) {\n        <nb-action\n          class=\"show-large-up\"\n          >\n          <ga-project-selector\n            dropdownClass=\"header-entity-select\"\n            [employeeId]=\"(employee$ | async)?.id\"\n            [shortened]=\"true\"\n            class=\"header-selector project-selector\"\n          ></ga-project-selector>\n        </nb-action>\n      }\n\n      @if (showEmployeesSelector && !showExtraActions && selectorsVisibility?.employee) {\n        <nb-action\n          class=\"show-large-up\"\n          >\n          <ga-employee-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector employee-selector\"\n          ></ga-employee-selector>\n        </nb-action>\n      }\n\n      @if (showDateSelector && !showExtraActions && selectorsVisibility?.date) {\n        <!-- .date-range-action: styled `position: static` so the picker's INLINE dropdown\n             escapes the .header-container scroll clip \u2014 see header.component.scss. -->\n        <nb-action class=\"date-range-action\">\n          @if (organization?.id) {\n            <ngx-date-range-picker\n              [firstDayOfWeek]=\"organization.startWeekOn\"\n              class=\"date-range-selector\"\n            ></ngx-date-range-picker>\n          }\n        </nb-action>\n      }\n\n      @if (showOrganizationsSelector && selectorsVisibility?.organization) {\n        <nb-action\n          class=\"show-large-up organization-selector-container\"\n          >\n          <ga-organization-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector organization-selector\"\n          ></ga-organization-selector>\n        </nb-action>\n      }\n\n      <nb-action\n        icon=\"options-2-outline\"\n        class=\"toggle-layout show-large-down\"\n        (click)=\"toggleExtraActions()\"\n      ></nb-action>\n\n      <!-- The speech-bubble help menu (Support Chat / FAQ / Help / About) used\n           to sit here. Those entries now live in the Quick Settings panel\n           (ngx-theme-settings), which is reached from the gear action below. -->\n\n      @if (isEnabledTimeTracking()) {\n        <nb-action class=\"timer-action\" (click)=\"toggleTimerWindow()\">\n          <nb-icon icon=\"clock-outline\"></nb-icon>\n          <span>{{ timerDuration }}</span>\n          <ga-time-tracker-status class=\"status\"></ga-time-tracker-status>\n        </nb-action>\n      }\n\n      <!-- The AI assistant entry point lives on the sidebar's brand row\n           (`.ai-agent-launch` in one-column.layout.html); a second copy here was\n           redundant, so the header no longer carries a chat control. -->\n\n      @for (action of navigationBuilderService.sidebarActions$ | async; track action) {\n        <nb-action\n          [icon]=\"action.icon\"\n          [class]=\"action.class\"\n          (click)=\"toggleSidebarActions(action)\"\n        ></nb-action>\n      }\n    </div>\n  </div>\n\n  @if (showExtraActions) {\n    <div (window:resize)=\"closeExtraActionsIfLarge($event)\" class=\"extra-actions\">\n      @if (selectorsVisibility?.team) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_TEAM' | translate }}</h6>\n        </div>\n        <ga-team-selector\n          dropdownClass=\"header-entity-select\"\n          [employeeId]=\"(employee$ | async)?.id\"\n          [projectId]=\"(project$ | async)?.id\"\n          [shortened]=\"true\"\n          class=\"header-selector team-selector\"\n        ></ga-team-selector>\n      }\n      @if (selectorsVisibility?.project) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_PROJECT' | translate }}</h6>\n        </div>\n        <ga-project-selector\n          dropdownClass=\"header-entity-select\"\n          [employeeId]=\"(employee$ | async)?.id\"\n          [shortened]=\"true\"\n          class=\"header-selector project-selector\"\n        ></ga-project-selector>\n      }\n      @if (selectorsVisibility?.employee) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_EMPLOYEE' | translate }}</h6>\n        </div>\n        @if (showEmployeesSelector) {\n          <ga-employee-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector employee-selector\"\n          ></ga-employee-selector>\n        }\n      }\n      @if (selectorsVisibility?.date) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_A_DATE' | translate }}</h6>\n        </div>\n        @if (showDateSelector) {\n          <ngx-date-range-picker class=\"date-range-selector\"></ngx-date-range-picker>\n        }\n      }\n      @if (selectorsVisibility?.organization) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_AN_ORGANIZATION' | translate }}</h6>\n        </div>\n        @if (showOrganizationsSelector) {\n          <ga-organization-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector organization-selector\"\n          ></ga-organization-selector>\n        }\n      }\n    </div>\n  }\n\n  @if (isEnabledTimeTracking()) {\n    <ng-template ngxPermissionsOnly=\"TIME_TRACKER\">\n      <ngx-web-time-tracker></ngx-web-time-tracker>\n    </ng-template>\n  }\n</div>\n", styles: [":host{width:100%}:host .notification-header{display:flex;align-items:center;justify-content:center;gap:.375rem;flex-wrap:wrap;width:100%;margin:0;padding:.375rem 1rem;position:relative;background-color:var(--color-primary-transparent-100);border-bottom:1px solid var(--color-primary-transparent-300);text-align:center;font-size:var(--gauzy-header-text-size, .6875rem);font-weight:400;line-height:1.4;letter-spacing:.01em;color:var(--text-hint-color)}:host .notification-header a{color:var(--text-primary-color);font-weight:600;text-decoration:none;border-bottom:1px solid transparent;transition:color .15s ease-in-out,border-color .15s ease-in-out}:host .notification-header a:hover,:host .notification-header a:focus-visible{color:var(--text-primary-hover-color);border-bottom-color:currentColor}:host .main-header{display:flex;align-items:center;justify-content:flex-end;width:100%;background-color:transparent}:host .main-header .show-large-down{display:none}:host .main-header .header-lead{display:flex;align-items:center;flex:none}[dir=ltr] :host .main-header .header-lead{margin-right:auto}[dir=rtl] :host .main-header .header-lead{margin-left:auto}[dir=ltr] :host .main-header .header-lead nb-action{padding-left:1.5rem}[dir=rtl] :host .main-header .header-lead nb-action{padding-right:1.5rem}:host .main-header .logo-container{display:flex;align-items:center;justify-content:space-between;max-width:var(--sidebar-width);width:var(--sidebar-width);margin-left:var(--sidebar-width-compact)}:host .main-header .logo-container ngx-gauzy-logo{width:100%}:host .main-header .logo-container.compacted{width:var(--sidebar-width-compact);justify-content:space-around;align-items:center}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace{box-shadow:none;width:1.75rem;height:auto}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace .tenant{display:none}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header{padding:0}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header nb-icon{border:none;left:0rem}:host .main-header nb-action{height:auto;display:flex;align-items:center;margin:0}:host .main-header nb-action .header-selector{width:auto!important}:host .main-header nb-action.date-range-action{position:static}:host .main-header ::ng-deep nb-search button{padding:0!important}:host .main-header .header-container{display:flex;align-items:center;gap:.75rem;width:auto;min-width:0;max-width:100%;overflow-x:auto;scrollbar-width:none}:host .main-header .header-container::-webkit-scrollbar{display:none}:host .main-header .header-container{z-index:5}[dir=ltr] :host .main-header .header-container .sidebar-toggle{padding-right:1.25rem}[dir=rtl] :host .main-header .header-container .sidebar-toggle{padding-left:1.25rem}:host .main-header .header-container .sidebar-toggle{text-decoration:none;color:var(--text-hint-color)}:host .main-header .header-container .sidebar-toggle nb-icon{font-size:1.75rem}:host .main-header .header-container .logo{cursor:pointer;font-size:1.85rem;padding:0 1.25rem;margin-top:5px;white-space:nowrap;text-decoration:none}:host .main-header .header-container .logo .gauzy-symbol{font-size:.6rem!important;margin-left:76px;margin-top:-25px;font-weight:700;position:absolute}@media(max-width:767.98px){:host .main-header .control-item{display:none}:host .main-header .user-action{border:none;padding:0}}@media(max-width:575.98px){:host .main-header nb-select{display:none}}@media(max-width:1199.98px){:host .main-header .show-large-up{display:none}:host .main-header .show-large-down{display:block}}.date-selector{max-width:160px;min-width:150px}.extra-actions{position:fixed;left:0;top:4.75rem;width:100%;height:calc(100vh - 4.75rem);background:var(--background-basic-color-1);overflow:hidden;display:flex;flex-direction:column;align-items:center;z-index:-1;padding-top:2.25rem;padding-left:2rem;padding-right:2rem}.extra-actions div,.extra-actions .organization-selector,.extra-actions .employee-selector,.extra-actions .date-selector,.extra-actions .team-selector,.extra-actions .project-selector{min-width:300px;width:100%;max-width:500px}.timer-action{display:flex;align-items:center;gap:.25rem;font-size:var(--gauzy-header-text-size, .6875rem);color:var(--gauzy-text-color-2, var(--text-hint-color))}.timer-action nb-icon{color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:1rem}.timer-action{cursor:pointer}.timer-action span{width:64px}.timer-action .status ::ng-deep svg{width:10px}.timer-card{position:relative;padding-top:12px}.timer-card .btn-close{position:absolute;right:5px;top:0;padding:2px}.button.create[nbButton].appearance-filled{border-width:0;font-size:var(--gauzy-header-text-size, .6875rem)}.date-range-selector ::ng-deep .custom-input{margin-right:0}.date-range-selector ::ng-deep .custom-input input{font-size:var(--gauzy-header-text-size, .6875rem);color:var(--gauzy-text-color-2, var(--text-hint-color))}.date-range-selector ::ng-deep .custom-input input.double-range{width:145px}.date-range-selector ::ng-deep .custom-input input.single-range{width:76px}.date-range-selector ::ng-deep i{color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:10px}:host .actions nb-action>nb-icon{font-size:1rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .actions nb-action.toggle-layout{width:var(--gauzy-header-control-height, 1.75rem);height:var(--gauzy-header-control-height, 1.75rem);padding:0;justify-content:center;border-radius:var(--gauzy-radius-sm, 6px);cursor:pointer;transition:background-color .12s ease-in-out}:host .actions nb-action.toggle-layout:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}.employee-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container{border-radius:var(--gauzy-radius-sm)!important}.employee-selector ::ng-deep .ng-select.ng-select-single .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-single .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-single .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-single .ng-select-container{height:var(--gauzy-header-control-height);background-color:var(--gauzy-card-1);min-height:var(--gauzy-header-control-height);min-width:4rem}.employee-selector ::ng-deep .ng-select .ng-select-container,.team-selector ::ng-deep .ng-select .ng-select-container,.project-selector ::ng-deep .ng-select .ng-select-container,.organization-selector ::ng-deep .ng-select .ng-select-container{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm)!important;background-color:var(--gauzy-card-1);transition:background-color .15s ease,box-shadow .15s ease}.employee-selector ::ng-deep .ng-select .ng-select-container .ng-value-container,.team-selector ::ng-deep .ng-select .ng-select-container .ng-value-container,.project-selector ::ng-deep .ng-select .ng-select-container .ng-value-container,.organization-selector ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:.625rem!important;min-width:0}.employee-selector ::ng-deep .ng-select,.team-selector ::ng-deep .ng-select,.project-selector ::ng-deep .ng-select,.organization-selector ::ng-deep .ng-select{font-size:var(--gauzy-header-text-size, .6875rem)}.employee-selector ::ng-deep .ng-select .ng-select-container .ng-value,.team-selector ::ng-deep .ng-select .ng-select-container .ng-value,.project-selector ::ng-deep .ng-select .ng-select-container .ng-value,.organization-selector ::ng-deep .ng-select .ng-select-container .ng-value{color:var(--gauzy-text-color-2, var(--text-hint-color));font-weight:400}.employee-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder,.team-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder,.project-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder,.organization-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder{color:var(--gauzy-text-color-2, var(--text-hint-color));font-weight:400}.employee-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.team-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.project-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.organization-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover{box-shadow:inset 0 0 0 1px var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important}.employee-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.team-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.project-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.organization-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container{background-image:linear-gradient(var(--gauzy-hover-tint, rgba(126, 126, 143, .12)),var(--gauzy-hover-tint, rgba(126, 126, 143, .12)))}.employee-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.team-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.project-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.organization-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover{background-image:linear-gradient(var(--gauzy-active-tint, rgba(126, 126, 143, .2)),var(--gauzy-active-tint, rgba(126, 126, 143, .2)))}.employee-selector ::ng-deep .ng-select .ng-clear-wrapper,.employee-selector ::ng-deep .ng-select .ng-arrow-wrapper,.team-selector ::ng-deep .ng-select .ng-clear-wrapper,.team-selector ::ng-deep .ng-select .ng-arrow-wrapper,.project-selector ::ng-deep .ng-select .ng-clear-wrapper,.project-selector ::ng-deep .ng-select .ng-arrow-wrapper,.organization-selector ::ng-deep .ng-select .ng-clear-wrapper,.organization-selector ::ng-deep .ng-select .ng-arrow-wrapper{margin-inline-start:.5rem}.employee-selector ::ng-deep .ng-select .ng-arrow-wrapper,.team-selector ::ng-deep .ng-select .ng-arrow-wrapper,.project-selector ::ng-deep .ng-select .ng-arrow-wrapper,.organization-selector ::ng-deep .ng-select .ng-arrow-wrapper{width:auto;padding-inline-start:0;padding-inline-end:.625rem}.employee-selector ::ng-deep .ng-select .ng-arrow,.team-selector ::ng-deep .ng-select .ng-arrow,.project-selector ::ng-deep .ng-select .ng-arrow,.organization-selector ::ng-deep .ng-select .ng-arrow{font-size:9px;color:var(--text-hint-color)}.employee-selector ::ng-deep .ng-select:hover .ng-arrow,.employee-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow,.team-selector ::ng-deep .ng-select:hover .ng-arrow,.team-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow,.project-selector ::ng-deep .ng-select:hover .ng-arrow,.project-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow,.organization-selector ::ng-deep .ng-select:hover .ng-arrow,.organization-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow{color:var(--text-basic-color)}.employee-selector ::ng-deep .ng-select .ng-clear-wrapper,.team-selector ::ng-deep .ng-select .ng-clear-wrapper,.project-selector ::ng-deep .ng-select .ng-clear-wrapper,.organization-selector ::ng-deep .ng-select .ng-clear-wrapper{color:var(--text-hint-color);width:.875rem}.employee-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear,.team-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear,.project-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear,.organization-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear{color:var(--text-basic-color)}.actions .project-selector,.actions .team-selector,.actions .employee-selector{min-width:9.5rem;max-width:9.5rem}:host .actions{display:flex;align-items:center;gap:.5rem;margin:.5rem;padding:0}[dir=ltr] :host .actions{margin-right:1.5rem}[dir=rtl] :host .actions{margin-left:1.5rem}.actions .organization-selector{min-width:auto;max-width:none}.actions .organization-selector ::ng-deep .ng-select .ng-select-container .selector-template:has(img) span{display:none}.actions .organization-selector ::ng-deep .ng-select .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-single .ng-select-container{background-color:transparent;box-shadow:none;min-width:0;padding-inline:.5rem}.actions .organization-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover{box-shadow:none!important}.actions .organization-selector ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:0!important}.actions .organization-selector ::ng-deep .ng-select .ng-arrow-wrapper{margin-inline-start:.25rem;padding-inline-end:0}.actions .organization-selector ::ng-deep .ng-select .ng-select-container .selector-template img{width:1.5rem;height:1.5rem}\n/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbActionComponent, selector: "nb-action", inputs: ["link", "href", "title", "icon", "disabled", "badgeDot", "badgeText", "badgeStatus", "badgePosition"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i5.DateRangePickerComponent, selector: "ngx-date-range-picker", inputs: ["arrows", "isLockDatePicker", "isSingleDatePicker", "isDisableFutureDatePicker", "isDisablePastDatePicker", "firstDayOfWeek", "timeZone", "unitOfTime", "selectedDateRange"] }, { kind: "component", type: i5.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "component", type: i5.OrganizationSelectorComponent, selector: "ga-organization-selector", inputs: ["addTag", "dropdownClass"] }, { kind: "component", type: i5.ProjectSelectorComponent, selector: "ga-project-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "projectId", "employeeId", "organizationContactId"], outputs: ["onChanged"] }, { kind: "component", type: i5.TeamSelectorComponent, selector: "ga-team-selector", inputs: ["shortened", "dropdownClass", "disabled", "multiple", "label", "placeholder", "skipGlobalChange", "defaultSelected", "showAllOption", "organizationTeamId", "employeeId", "projectId"], outputs: ["onChanged"] }, { kind: "directive", type: i6.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i5.TimeTrackerComponent, selector: "ngx-web-time-tracker" }, { kind: "component", type: i5.TimeTrackerStatusComponent, selector: "ga-time-tracker-status" }, { kind: "pipe", type: i7.AsyncPipe, name: "async" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
HeaderComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbSidebarService,
        LayoutService,
        NbThemeService,
        Router,
        TranslateService,
        Store,
        TimeTrackerService,
        UsersOrganizationsService,
        OrganizationsService,
        EmployeesService,
        OrganizationProjectsService,
        OrganizationTeamsService,
        NavigationBuilderService,
        DateRangePickerBuilderService,
        OrganizationEditStore,
        OrganizationProjectStore,
        OrganizationTeamStore,
        EmployeeStore,
        SelectorBuilderService,
        ChangeDetectorRef,
        NbDialogService])
], HeaderComponent);
export { HeaderComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-header', standalone: false, template: "@if (isDemo) {\n  <div class=\"notification-header\">\n    You are using a demo account. Finding our software useful?\n    <a href=\"/auth/register\"> Click here to Sign Up and start using for free! </a>\n  </div>\n}\n<div class=\"main-header\">\n  <!-- The breadcrumb trail used to live here. It now renders under the page\n       title (ngx-header-title): the header band is already dense with\n       selectors, and the trail was being squeezed to nothing on pages that\n       show every selector. -->\n  @if (createQuickActionsMenu?.length > 0) {\n    <div class=\"header-lead\">\n      <nb-action\n        size=\"small\"\n        [class.left]=\"position === 'normal'\"\n        [class.right]=\"position === 'inverse'\"\n        class=\"show-large-up\"\n        >\n        <button type=\"button\" nbButton class=\"button create\" status=\"primary\" size=\"small\" (click)=\"openQuickActions()\">\n          + {{ 'BUTTONS.CREATE' | translate }}\n        </button>\n      </nb-action>\n    </div>\n  }\n  <div class=\"header-container\">\n    <div class=\"actions\" size=\"small\" [class.left]=\"position === 'normal'\" [class.right]=\"position === 'inverse'\">\n      @if (showTeamsSelector && !showExtraActions && selectorsVisibility?.team) {\n        <nb-action\n          class=\"show-large-up\"\n          >\n          <ga-team-selector\n            dropdownClass=\"header-entity-select\"\n            [employeeId]=\"(employee$ | async)?.id\"\n            [projectId]=\"(project$ | async)?.id\"\n            [shortened]=\"true\"\n            class=\"header-selector team-selector\"\n          ></ga-team-selector>\n        </nb-action>\n      }\n\n      @if (showProjectsSelector && !showExtraActions && selectorsVisibility?.project) {\n        <nb-action\n          class=\"show-large-up\"\n          >\n          <ga-project-selector\n            dropdownClass=\"header-entity-select\"\n            [employeeId]=\"(employee$ | async)?.id\"\n            [shortened]=\"true\"\n            class=\"header-selector project-selector\"\n          ></ga-project-selector>\n        </nb-action>\n      }\n\n      @if (showEmployeesSelector && !showExtraActions && selectorsVisibility?.employee) {\n        <nb-action\n          class=\"show-large-up\"\n          >\n          <ga-employee-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector employee-selector\"\n          ></ga-employee-selector>\n        </nb-action>\n      }\n\n      @if (showDateSelector && !showExtraActions && selectorsVisibility?.date) {\n        <!-- .date-range-action: styled `position: static` so the picker's INLINE dropdown\n             escapes the .header-container scroll clip \u2014 see header.component.scss. -->\n        <nb-action class=\"date-range-action\">\n          @if (organization?.id) {\n            <ngx-date-range-picker\n              [firstDayOfWeek]=\"organization.startWeekOn\"\n              class=\"date-range-selector\"\n            ></ngx-date-range-picker>\n          }\n        </nb-action>\n      }\n\n      @if (showOrganizationsSelector && selectorsVisibility?.organization) {\n        <nb-action\n          class=\"show-large-up organization-selector-container\"\n          >\n          <ga-organization-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector organization-selector\"\n          ></ga-organization-selector>\n        </nb-action>\n      }\n\n      <nb-action\n        icon=\"options-2-outline\"\n        class=\"toggle-layout show-large-down\"\n        (click)=\"toggleExtraActions()\"\n      ></nb-action>\n\n      <!-- The speech-bubble help menu (Support Chat / FAQ / Help / About) used\n           to sit here. Those entries now live in the Quick Settings panel\n           (ngx-theme-settings), which is reached from the gear action below. -->\n\n      @if (isEnabledTimeTracking()) {\n        <nb-action class=\"timer-action\" (click)=\"toggleTimerWindow()\">\n          <nb-icon icon=\"clock-outline\"></nb-icon>\n          <span>{{ timerDuration }}</span>\n          <ga-time-tracker-status class=\"status\"></ga-time-tracker-status>\n        </nb-action>\n      }\n\n      <!-- The AI assistant entry point lives on the sidebar's brand row\n           (`.ai-agent-launch` in one-column.layout.html); a second copy here was\n           redundant, so the header no longer carries a chat control. -->\n\n      @for (action of navigationBuilderService.sidebarActions$ | async; track action) {\n        <nb-action\n          [icon]=\"action.icon\"\n          [class]=\"action.class\"\n          (click)=\"toggleSidebarActions(action)\"\n        ></nb-action>\n      }\n    </div>\n  </div>\n\n  @if (showExtraActions) {\n    <div (window:resize)=\"closeExtraActionsIfLarge($event)\" class=\"extra-actions\">\n      @if (selectorsVisibility?.team) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_TEAM' | translate }}</h6>\n        </div>\n        <ga-team-selector\n          dropdownClass=\"header-entity-select\"\n          [employeeId]=\"(employee$ | async)?.id\"\n          [projectId]=\"(project$ | async)?.id\"\n          [shortened]=\"true\"\n          class=\"header-selector team-selector\"\n        ></ga-team-selector>\n      }\n      @if (selectorsVisibility?.project) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_PROJECT' | translate }}</h6>\n        </div>\n        <ga-project-selector\n          dropdownClass=\"header-entity-select\"\n          [employeeId]=\"(employee$ | async)?.id\"\n          [shortened]=\"true\"\n          class=\"header-selector project-selector\"\n        ></ga-project-selector>\n      }\n      @if (selectorsVisibility?.employee) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_EMPLOYEE' | translate }}</h6>\n        </div>\n        @if (showEmployeesSelector) {\n          <ga-employee-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector employee-selector\"\n          ></ga-employee-selector>\n        }\n      }\n      @if (selectorsVisibility?.date) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_A_DATE' | translate }}</h6>\n        </div>\n        @if (showDateSelector) {\n          <ngx-date-range-picker class=\"date-range-selector\"></ngx-date-range-picker>\n        }\n      }\n      @if (selectorsVisibility?.organization) {\n        <div>\n          <h6>{{ 'HEADER.SELECT_AN_ORGANIZATION' | translate }}</h6>\n        </div>\n        @if (showOrganizationsSelector) {\n          <ga-organization-selector\n            dropdownClass=\"header-entity-select\"\n            class=\"header-selector organization-selector\"\n          ></ga-organization-selector>\n        }\n      }\n    </div>\n  }\n\n  @if (isEnabledTimeTracking()) {\n    <ng-template ngxPermissionsOnly=\"TIME_TRACKER\">\n      <ngx-web-time-tracker></ngx-web-time-tracker>\n    </ng-template>\n  }\n</div>\n", styles: [":host{width:100%}:host .notification-header{display:flex;align-items:center;justify-content:center;gap:.375rem;flex-wrap:wrap;width:100%;margin:0;padding:.375rem 1rem;position:relative;background-color:var(--color-primary-transparent-100);border-bottom:1px solid var(--color-primary-transparent-300);text-align:center;font-size:var(--gauzy-header-text-size, .6875rem);font-weight:400;line-height:1.4;letter-spacing:.01em;color:var(--text-hint-color)}:host .notification-header a{color:var(--text-primary-color);font-weight:600;text-decoration:none;border-bottom:1px solid transparent;transition:color .15s ease-in-out,border-color .15s ease-in-out}:host .notification-header a:hover,:host .notification-header a:focus-visible{color:var(--text-primary-hover-color);border-bottom-color:currentColor}:host .main-header{display:flex;align-items:center;justify-content:flex-end;width:100%;background-color:transparent}:host .main-header .show-large-down{display:none}:host .main-header .header-lead{display:flex;align-items:center;flex:none}[dir=ltr] :host .main-header .header-lead{margin-right:auto}[dir=rtl] :host .main-header .header-lead{margin-left:auto}[dir=ltr] :host .main-header .header-lead nb-action{padding-left:1.5rem}[dir=rtl] :host .main-header .header-lead nb-action{padding-right:1.5rem}:host .main-header .logo-container{display:flex;align-items:center;justify-content:space-between;max-width:var(--sidebar-width);width:var(--sidebar-width);margin-left:var(--sidebar-width-compact)}:host .main-header .logo-container ngx-gauzy-logo{width:100%}:host .main-header .logo-container.compacted{width:var(--sidebar-width-compact);justify-content:space-around;align-items:center}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace{box-shadow:none;width:1.75rem;height:auto}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace .tenant{display:none}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header{padding:0}:host .main-header .logo-container.compacted ::ng-deep .accordion.workspace nb-accordion-item-header nb-icon{border:none;left:0rem}:host .main-header nb-action{height:auto;display:flex;align-items:center;margin:0}:host .main-header nb-action .header-selector{width:auto!important}:host .main-header nb-action.date-range-action{position:static}:host .main-header ::ng-deep nb-search button{padding:0!important}:host .main-header .header-container{display:flex;align-items:center;gap:.75rem;width:auto;min-width:0;max-width:100%;overflow-x:auto;scrollbar-width:none}:host .main-header .header-container::-webkit-scrollbar{display:none}:host .main-header .header-container{z-index:5}[dir=ltr] :host .main-header .header-container .sidebar-toggle{padding-right:1.25rem}[dir=rtl] :host .main-header .header-container .sidebar-toggle{padding-left:1.25rem}:host .main-header .header-container .sidebar-toggle{text-decoration:none;color:var(--text-hint-color)}:host .main-header .header-container .sidebar-toggle nb-icon{font-size:1.75rem}:host .main-header .header-container .logo{cursor:pointer;font-size:1.85rem;padding:0 1.25rem;margin-top:5px;white-space:nowrap;text-decoration:none}:host .main-header .header-container .logo .gauzy-symbol{font-size:.6rem!important;margin-left:76px;margin-top:-25px;font-weight:700;position:absolute}@media(max-width:767.98px){:host .main-header .control-item{display:none}:host .main-header .user-action{border:none;padding:0}}@media(max-width:575.98px){:host .main-header nb-select{display:none}}@media(max-width:1199.98px){:host .main-header .show-large-up{display:none}:host .main-header .show-large-down{display:block}}.date-selector{max-width:160px;min-width:150px}.extra-actions{position:fixed;left:0;top:4.75rem;width:100%;height:calc(100vh - 4.75rem);background:var(--background-basic-color-1);overflow:hidden;display:flex;flex-direction:column;align-items:center;z-index:-1;padding-top:2.25rem;padding-left:2rem;padding-right:2rem}.extra-actions div,.extra-actions .organization-selector,.extra-actions .employee-selector,.extra-actions .date-selector,.extra-actions .team-selector,.extra-actions .project-selector{min-width:300px;width:100%;max-width:500px}.timer-action{display:flex;align-items:center;gap:.25rem;font-size:var(--gauzy-header-text-size, .6875rem);color:var(--gauzy-text-color-2, var(--text-hint-color))}.timer-action nb-icon{color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:1rem}.timer-action{cursor:pointer}.timer-action span{width:64px}.timer-action .status ::ng-deep svg{width:10px}.timer-card{position:relative;padding-top:12px}.timer-card .btn-close{position:absolute;right:5px;top:0;padding:2px}.button.create[nbButton].appearance-filled{border-width:0;font-size:var(--gauzy-header-text-size, .6875rem)}.date-range-selector ::ng-deep .custom-input{margin-right:0}.date-range-selector ::ng-deep .custom-input input{font-size:var(--gauzy-header-text-size, .6875rem);color:var(--gauzy-text-color-2, var(--text-hint-color))}.date-range-selector ::ng-deep .custom-input input.double-range{width:145px}.date-range-selector ::ng-deep .custom-input input.single-range{width:76px}.date-range-selector ::ng-deep i{color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:10px}:host .actions nb-action>nb-icon{font-size:1rem;color:var(--gauzy-text-color-2, var(--text-hint-color))}:host .actions nb-action.toggle-layout{width:var(--gauzy-header-control-height, 1.75rem);height:var(--gauzy-header-control-height, 1.75rem);padding:0;justify-content:center;border-radius:var(--gauzy-radius-sm, 6px);cursor:pointer;transition:background-color .12s ease-in-out}:host .actions nb-action.toggle-layout:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}.employee-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened.ng-select-bottom>.ng-select-container{border-radius:var(--gauzy-radius-sm)!important}.employee-selector ::ng-deep .ng-select.ng-select-single .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-single .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-single .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-single .ng-select-container{height:var(--gauzy-header-control-height);background-color:var(--gauzy-card-1);min-height:var(--gauzy-header-control-height);min-width:4rem}.employee-selector ::ng-deep .ng-select .ng-select-container,.team-selector ::ng-deep .ng-select .ng-select-container,.project-selector ::ng-deep .ng-select .ng-select-container,.organization-selector ::ng-deep .ng-select .ng-select-container{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm)!important;background-color:var(--gauzy-card-1);transition:background-color .15s ease,box-shadow .15s ease}.employee-selector ::ng-deep .ng-select .ng-select-container .ng-value-container,.team-selector ::ng-deep .ng-select .ng-select-container .ng-value-container,.project-selector ::ng-deep .ng-select .ng-select-container .ng-value-container,.organization-selector ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:.625rem!important;min-width:0}.employee-selector ::ng-deep .ng-select,.team-selector ::ng-deep .ng-select,.project-selector ::ng-deep .ng-select,.organization-selector ::ng-deep .ng-select{font-size:var(--gauzy-header-text-size, .6875rem)}.employee-selector ::ng-deep .ng-select .ng-select-container .ng-value,.team-selector ::ng-deep .ng-select .ng-select-container .ng-value,.project-selector ::ng-deep .ng-select .ng-select-container .ng-value,.organization-selector ::ng-deep .ng-select .ng-select-container .ng-value{color:var(--gauzy-text-color-2, var(--text-hint-color));font-weight:400}.employee-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder,.team-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder,.project-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder,.organization-selector ::ng-deep .ng-select .ng-select-container .ng-placeholder{color:var(--gauzy-text-color-2, var(--text-hint-color));font-weight:400}.employee-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.team-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.project-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.organization-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover{box-shadow:inset 0 0 0 1px var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important}.employee-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.team-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.project-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.organization-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container{background-image:linear-gradient(var(--gauzy-hover-tint, rgba(126, 126, 143, .12)),var(--gauzy-hover-tint, rgba(126, 126, 143, .12)))}.employee-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.employee-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.team-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.team-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.project-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.project-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover,.organization-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.organization-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover{background-image:linear-gradient(var(--gauzy-active-tint, rgba(126, 126, 143, .2)),var(--gauzy-active-tint, rgba(126, 126, 143, .2)))}.employee-selector ::ng-deep .ng-select .ng-clear-wrapper,.employee-selector ::ng-deep .ng-select .ng-arrow-wrapper,.team-selector ::ng-deep .ng-select .ng-clear-wrapper,.team-selector ::ng-deep .ng-select .ng-arrow-wrapper,.project-selector ::ng-deep .ng-select .ng-clear-wrapper,.project-selector ::ng-deep .ng-select .ng-arrow-wrapper,.organization-selector ::ng-deep .ng-select .ng-clear-wrapper,.organization-selector ::ng-deep .ng-select .ng-arrow-wrapper{margin-inline-start:.5rem}.employee-selector ::ng-deep .ng-select .ng-arrow-wrapper,.team-selector ::ng-deep .ng-select .ng-arrow-wrapper,.project-selector ::ng-deep .ng-select .ng-arrow-wrapper,.organization-selector ::ng-deep .ng-select .ng-arrow-wrapper{width:auto;padding-inline-start:0;padding-inline-end:.625rem}.employee-selector ::ng-deep .ng-select .ng-arrow,.team-selector ::ng-deep .ng-select .ng-arrow,.project-selector ::ng-deep .ng-select .ng-arrow,.organization-selector ::ng-deep .ng-select .ng-arrow{font-size:9px;color:var(--text-hint-color)}.employee-selector ::ng-deep .ng-select:hover .ng-arrow,.employee-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow,.team-selector ::ng-deep .ng-select:hover .ng-arrow,.team-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow,.project-selector ::ng-deep .ng-select:hover .ng-arrow,.project-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow,.organization-selector ::ng-deep .ng-select:hover .ng-arrow,.organization-selector ::ng-deep .ng-select.ng-select-opened .ng-arrow{color:var(--text-basic-color)}.employee-selector ::ng-deep .ng-select .ng-clear-wrapper,.team-selector ::ng-deep .ng-select .ng-clear-wrapper,.project-selector ::ng-deep .ng-select .ng-clear-wrapper,.organization-selector ::ng-deep .ng-select .ng-clear-wrapper{color:var(--text-hint-color);width:.875rem}.employee-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear,.team-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear,.project-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear,.organization-selector ::ng-deep .ng-select .ng-clear-wrapper:hover .ng-clear{color:var(--text-basic-color)}.actions .project-selector,.actions .team-selector,.actions .employee-selector{min-width:9.5rem;max-width:9.5rem}:host .actions{display:flex;align-items:center;gap:.5rem;margin:.5rem;padding:0}[dir=ltr] :host .actions{margin-right:1.5rem}[dir=rtl] :host .actions{margin-left:1.5rem}.actions .organization-selector{min-width:auto;max-width:none}.actions .organization-selector ::ng-deep .ng-select .ng-select-container .selector-template:has(img) span{display:none}.actions .organization-selector ::ng-deep .ng-select .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-single .ng-select-container{background-color:transparent;box-shadow:none;min-width:0;padding-inline:.5rem}.actions .organization-selector ::ng-deep .ng-select:not(.ng-select-disabled):hover .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-focused .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-opened .ng-select-container,.actions .organization-selector ::ng-deep .ng-select.ng-select-opened>.ng-select-container:hover{box-shadow:none!important}.actions .organization-selector ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:0!important}.actions .organization-selector ::ng-deep .ng-select .ng-arrow-wrapper{margin-inline-start:.25rem;padding-inline-end:0}.actions .organization-selector ::ng-deep .ng-select .ng-select-container .selector-template img{width:1.5rem;height:1.5rem}\n/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbSidebarService }, { type: i2.LayoutService }, { type: i1.NbThemeService }, { type: i3.Router }, { type: i4.TranslateService }, { type: i2.Store }, { type: i2.TimeTrackerService }, { type: i2.UsersOrganizationsService }, { type: i2.OrganizationsService }, { type: i2.EmployeesService }, { type: i2.OrganizationProjectsService }, { type: i2.OrganizationTeamsService }, { type: i2.NavigationBuilderService }, { type: i2.DateRangePickerBuilderService }, { type: i2.OrganizationEditStore }, { type: i2.OrganizationProjectStore }, { type: i2.OrganizationTeamStore }, { type: i2.EmployeeStore }, { type: i2.SelectorBuilderService }, { type: i0.ChangeDetectorRef }, { type: i1.NbDialogService }], propDecorators: { position: [{
                type: Input
            }], expanded: [{
                type: Input
            }] } });
//# sourceMappingURL=header.component.js.map