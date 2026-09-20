import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IUser, ITag, IRole, RolesEnum, IImageAsset } from '@gauzy/contracts';
import { AuthService, ErrorHandlingService, RoleService, Store, ToastrService, UsersService } from '@gauzy/ui-core/core';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
export declare class EditProfileFormComponent implements OnInit, OnDestroy {
    private readonly _fb;
    private readonly _authService;
    private readonly _userService;
    private readonly _store;
    private readonly _toastrService;
    private readonly _errorHandler;
    private readonly _roleService;
    FormHelpers: typeof FormHelpers;
    hoverState: boolean;
    loading: boolean;
    listOfTimeFormats: number[];
    role: IRole;
    user: IUser;
    user$: Subject<any>;
    _selectedUser: IUser;
    get selectedUser(): IUser;
    set selectedUser(value: IUser);
    _allowRoleChange: boolean;
    get allowRoleChange(): boolean;
    set allowRoleChange(value: boolean);
    userSubmitted: EventEmitter<void>;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    excludes: RolesEnum[];
    constructor(_fb: UntypedFormBuilder, _authService: AuthService, _userService: UsersService, _store: Store, _toastrService: ToastrService, _errorHandler: ErrorHandlingService, _roleService: RoleService);
    ngOnInit(): Promise<void>;
    /**
     * Excludes roles based on the user's permissions.
     * Adds the SUPER_ADMIN role to the excludes list if the user lacks SUPER_ADMIN privileges.
     */
    excludeRoles(): Promise<void>;
    /**
     * Retrieves the profile of the selected user or the current user.
     * Fetches user details including tags and role, and updates the form.
     */
    getUserProfile(): Promise<void>;
    handleImageUploadError(error: any): void;
    updateImageAsset(image: IImageAsset): Promise<void>;
    submitForm(): Promise<void>;
    private _patchForm;
    /**
     *
     * @param tags
     */
    selectedTagsHandler(tags: ITag[]): void;
    /**
     * On Selection Change
     * @param role
     */
    onSelectionChange(role: IRole): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditProfileFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EditProfileFormComponent, "ngx-profile", never, { "selectedUser": { "alias": "selectedUser"; "required": false; }; "allowRoleChange": { "alias": "allowRoleChange"; "required": false; }; }, { "userSubmitted": "userSubmitted"; }, never, never, false, never>;
}
