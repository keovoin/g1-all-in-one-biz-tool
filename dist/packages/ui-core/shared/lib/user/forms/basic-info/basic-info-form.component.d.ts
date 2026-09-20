import { ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { RolesEnum, ITag, IUser, IRole, IOrganization, ICandidate, IImageAsset, IEmployee, ID } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { AuthService, CandidatesService, EmployeesService, ErrorHandlingService, RoleService, Store } from '@gauzy/ui-core/core';
import { FormHelpers } from '../../../forms/helpers';
import * as i0 from "@angular/core";
export declare class BasicInfoFormComponent extends TranslationBaseComponent implements OnInit, AfterViewInit {
    readonly translateService: TranslateService;
    private readonly _location;
    private readonly _fb;
    private readonly _authService;
    private readonly _roleService;
    private readonly _employeesService;
    private readonly _candidatesService;
    private readonly _store;
    private readonly _errorHandlingService;
    FormHelpers: typeof FormHelpers;
    excludes: RolesEnum[];
    organization: IOrganization;
    selectedTags: ITag[];
    private _isCandidate;
    get isCandidate(): boolean;
    set isCandidate(value: boolean);
    private _isEmployee;
    get isEmployee(): boolean;
    set isEmployee(value: boolean);
    private _isShowRole;
    get isShowRole(): boolean;
    set isShowRole(value: boolean);
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder, self: BasicInfoFormComponent): UntypedFormGroup;
    imagePreviewElement: ElementRef;
    constructor(translateService: TranslateService, _location: Location, _fb: UntypedFormBuilder, _authService: AuthService, _roleService: RoleService, _employeesService: EmployeesService, _candidatesService: CandidatesService, _store: Store, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Excludes the SUPER_ADMIN role if the current user doesn't have the necessary permissions.
     */
    excludeRoles(): Promise<void>;
    /**
     * Checks if the current form's role is either SUPER_ADMIN or ADMIN.
     *
     * @returns A boolean indicating whether the role is SUPER_ADMIN or ADMIN.
     */
    enableEmployee(): boolean;
    get showImageMeta(): any;
    /**
     * Registers a user with different roles
     *
     * @param defaultRoleName - Default role to assign if none is specified
     * @param organizationId - ID of the organization
     * @param createdByUserId - ID of the user who created this user
     * @returns A promise of the created user or employee
     */
    registerUser(defaultRoleName: RolesEnum, organizationId?: ID, createdByUserId?: ID): Promise<any>;
    /**
     * Creates a user with the specified attributes, either as an employee or a regular user.
     *
     * @param user - The user details.
     * @param password - The password for the user.
     * @param organizationId - (Optional) The ID of the organization.
     * @param createdByUserId - (Optional) The ID of the user who created this user.
     * @param featureAsEmployee - (Optional) Whether to create the user as an employee.
     * @returns A promise resolving to the created user or employee.
     */
    private createUser;
    /**
     * Fetches a role based on the provided role name and tenant ID.
     *
     * @param roleName - The name of the role to fetch.
     * @param tenantId - The ID of the tenant to which the role belongs.
     * @returns A promise resolving to the role object.
     */
    private getRole;
    /**
     * Delete existing image
     */
    deleteImageUrl(): void;
    /**
     * Handle selected tags
     *
     * @param tags An array of tags to set in the form control.
     */
    selectedTagsHandler(tags: ITag[]): void;
    ngAfterViewInit(): void;
    /**
     * Upload profile image/avatar
     *
     * @param image
     */
    updateImageAsset(image: IImageAsset): void;
    /**
     * Upload third party URL as image/avatar
     *
     * @param imageUrl The URL of the image to update in the form control.
     */
    updateImageUrl(imageUrl: string): void;
    /**
     * Sets up validation for image URL based on image loading status.
     */
    private _setupLogoUrlValidation;
    /**
     * Handle selection change for roles.
     *
     * @param role The selected role object.
     */
    onSelectionChange(role: IRole): void;
    /**
     * SET role field validations based on the given value.
     *
     * @param value Indicates whether role validation is required (true) or not (false).
     */
    setRoleValidations(value: boolean): void;
    /**
     * Create an employee from the user page.
     *
     * @param user The user object containing employee details.
     * @returns A promise that resolves to the created employee.
     */
    createEmployee(user: IUser): Promise<IEmployee>;
    /**
     * Create a candidate from user page.
     *
     * @param user The IUser object containing candidate's user details.
     * @returns A Promise resolving to the created ICandidate object.
     */
    createCandidate(user: IUser): Promise<ICandidate>;
    /**
     * GET location old state & patch form value
     * We are using such functionality for create new employee from header selector
     *
     * @param state
     */
    patchUsingLocationState(state: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BasicInfoFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BasicInfoFormComponent, "ga-user-basic-info-form", never, { "selectedTags": { "alias": "selectedTags"; "required": false; }; "isCandidate": { "alias": "isCandidate"; "required": false; }; "isEmployee": { "alias": "isEmployee"; "required": false; }; "isShowRole": { "alias": "isShowRole"; "required": false; }; }, {}, never, never, false, never>;
}
