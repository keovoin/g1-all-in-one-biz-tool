import { ChangeDetectorRef } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IOrganizationCreateInput, IUserSigninWorkspaceResponse } from '@gauzy/contracts';
import { ErrorHandlingService, Store, WorkspaceAuthService } from '@gauzy/ui-core/core';
import { BaseWorkspaceAuthComponent, CountdownTimerService } from '../shared';
import * as i0 from "@angular/core";
export declare class WorkspaceCreateComponent extends BaseWorkspaceAuthComponent {
    readonly translateService: TranslateService;
    protected readonly _fb: UntypedFormBuilder;
    readonly cdr: ChangeDetectorRef;
    protected readonly _errorHandlingService: ErrorHandlingService;
    protected readonly _store: Store;
    protected readonly _workspaceAuthService: WorkspaceAuthService;
    protected readonly _timerService: CountdownTimerService;
    showCreationStep: boolean;
    showAccountCreation: boolean;
    showPassword: boolean;
    showConfirmPassword: boolean;
    /**
     * FormGroup instance representing the account creation form (profile + password).
     */
    accountForm: UntypedFormGroup;
    /**
     * Static method to build the account creation form using Angular's FormBuilder.
     * Reuses existing form validation patterns from AcceptInviteFormComponent
     */
    static buildAccountForm(fb: UntypedFormBuilder): UntypedFormGroup;
    /**
     * Getter for the fullName form control.
     */
    get fullName(): AbstractControl;
    /**
     * Getter for the password form control.
     */
    get password(): AbstractControl;
    /**
     * Getter for the confirmPassword form control.
     */
    get confirmPassword(): AbstractControl;
    constructor(translateService: TranslateService, _fb: UntypedFormBuilder, cdr: ChangeDetectorRef, _errorHandlingService: ErrorHandlingService, _store: Store, _workspaceAuthService: WorkspaceAuthService, _timerService: CountdownTimerService);
    /**
     * Handle edit email button click
     */
    onEditEmail(): void;
    /**
     * Continue to account creation step (fullName, password)
     */
    continueToCreation(): void;
    /**
     * Continue to workspace creation step after account creation
     */
    continueToWorkspaceCreation(): void;
    /**
     * Handle component-specific logic after confirmation response.
     * For workspace creation: show workspace selection if user has workspaces, otherwise go to creation.
     */
    protected handleConfirmationResponse(response: IUserSigninWorkspaceResponse): void;
    /**
     * Handle workspace creation from onboarding form using the workspace auth service.
     */
    onboardUser(organization: IOrganizationCreateInput): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceCreateComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkspaceCreateComponent, "ga-workspace-create", never, {}, {}, never, never, false, never>;
}
