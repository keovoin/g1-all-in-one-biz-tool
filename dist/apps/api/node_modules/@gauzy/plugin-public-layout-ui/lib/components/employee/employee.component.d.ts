import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { IEmployee, IEmployeeAward, IOrganization, IImageAsset } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeesService, ErrorHandlingService, Store, ToastrService, UsersService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class EmployeeComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _employeeService;
    private readonly _userService;
    private readonly _route;
    private readonly _dialogService;
    private readonly _toastrService;
    private readonly _store;
    private readonly _errorHandlingService;
    hasEditPermission$: Observable<boolean>;
    imageUrl: string;
    imageUpdateButton: boolean;
    organization$: Observable<IOrganization>;
    organization: IOrganization;
    employee$: Observable<IEmployee>;
    hoverState: boolean;
    employeeAwards: IEmployeeAward[];
    constructor(translateService: TranslateService, _employeeService: EmployeesService, _userService: UsersService, _route: ActivatedRoute, _dialogService: NbDialogService, _toastrService: ToastrService, _store: Store, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Upload organization image/avatar
     *
     * @param image
     */
    updateImageAsset(image: IImageAsset): void;
    /**
     * Updates the image url of an employee.
     *
     * @param url - The image url to be updated.
     */
    updateImageUrl(url: string): void;
    /**
     * Saves the image of an employee.
     *
     * @param param0 - The user id and image url to be saved.
     */
    saveImage({ userId, imageUrl }: {
        userId: any;
        imageUrl: any;
    }): Promise<void>;
    /**
     * Opens a dialog to edit an employee.
     *
     * @param {IEmployee} employee - The employee to be edited.
     * @return {void} This function does not return a value.
     */
    openEditEmployeeDialog(employee: IEmployee): void;
    /**
     * Handles the update of an employee.
     *
     * @param employee
     * @param formValue
     * @returns
     */
    handleEmployeeUpdate(employee: IEmployee, formValue: any): Promise<void>;
    /**
     *
     * @param error - The error to be handled.
     * @return {void} This function does not return a value.
     */
    handleImageUploadError(error: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmployeeComponent, "ngx-employee-share", never, {}, {}, never, never, false, never>;
}
