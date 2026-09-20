import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization, IOrganizationContact, IEmployee } from '@gauzy/contracts';
import { NbDialogService, NbTabComponent, NbTabsetComponent } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { DateRangePickerBuilderService, EmployeeStatisticsService, EmployeesService, ErrorHandlingService, OrganizationsService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class OrganizationComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly router;
    private readonly route;
    private readonly organizationsService;
    private readonly toastrService;
    private readonly employeesService;
    private readonly employeeStatisticsService;
    private readonly store;
    private readonly dateRangePickerService;
    private readonly dialogService;
    private readonly _errorHandlingService;
    hasEditPublicPage$: Observable<boolean>;
    organization: IOrganization;
    organization$: Observable<IOrganization>;
    employees$: Observable<IEmployee[]>;
    employeeCounts$: Observable<Number>;
    clients$: Observable<IOrganizationContact[]>;
    clientCounts$: Observable<Number>;
    projectCounts$: Observable<Number>;
    bonusesPaid: number;
    totalIncome: number;
    profits: number;
    imageUrl: string;
    hoverState: boolean;
    imageUpdateButton: boolean;
    /**
     * Reload Resolver Subject
     */
    reload$: Subject<boolean>;
    /**
     * Tabset Type of the ViewChild metadata.
     */
    tabsetEl: NbTabsetComponent;
    profileTabEl: NbTabComponent;
    constructor(translateService: TranslateService, router: Router, route: ActivatedRoute, organizationsService: OrganizationsService, toastrService: ToastrService, employeesService: EmployeesService, employeeStatisticsService: EmployeeStatisticsService, store: Store, dateRangePickerService: DateRangePickerBuilderService, dialogService: NbDialogService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Reload Resolver
     */
    reloadResolver(): void;
    /**
     * Updates the image url of the organization.
     *
     * @param url - The image url to be updated.
     */
    updateImageUrl(url: string): void;
    /**
     * Handles the error while uploading an image.
     *
     * @param event - The error event to be handled.
     * @return {void} This function does not return a value.
     */
    handleImageUploadError(event: any): void;
    /**
     * GET public information of the clients in the organization
     * GET clients counts in the organization
     *
     * @returns
     */
    private getClientsAndClientCounts;
    /**
     * GET project counts in the organization
     *
     * @returns
     */
    private getProjectCounts;
    /**
     * GET public information of the employees in the organization
     * GET employees counts in the organization
     *
     * @returns
     */
    private getEmployeesAndEmployeeCounts;
    /**
     * GET public information of the employees in the organization
     *
     * @returns
     */
    private getEmployeeStatistics;
    saveImage(organization: any): Promise<void>;
    /**
     * Opens a dialog to edit the public page of the organization and updates the organization data if successful.
     *
     * @return {void}
     */
    editPublicPage(): void;
    /**
     * If clients tab is active and privacy mutation turned off clients view.
     * We have to removed clients tab from UI and default select profile tab.
     */
    private _changeClientsTabIfActiveAndPrivacyIsTurnedOff;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OrganizationComponent, "ngx-public-organization", never, {}, {}, never, never, false, never>;
}
