import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IAuthResponse, IUserSigninWorkspaceResponse, IWorkspaceResponse } from '@gauzy/contracts';
import { ErrorHandlingService, Store, WorkspaceAuthService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CountdownTimerService } from './countdown-timer.service';
import * as i0 from "@angular/core";
/**
 * Abstract base component for workspace authentication flows when user is already connected.
 * Contains shared functionality for magic code authentication, timer management,
 * and workspace selection that is common across workspace-create, workspace-signin, and workspace-find components.
 */
export declare abstract class BaseWorkspaceAuthComponent extends TranslationBaseComponent implements OnDestroy {
    readonly translateService: TranslateService;
    protected readonly _fb: UntypedFormBuilder;
    readonly cdr: ChangeDetectorRef;
    protected readonly _errorHandlingService: ErrorHandlingService;
    protected readonly _store: Store;
    protected readonly _workspaceAuthService: WorkspaceAuthService;
    protected readonly _timerService: CountdownTimerService;
    countdown: number;
    readonly codeLength = 8;
    isLoading: boolean;
    isCodeSent: boolean;
    isCodeResent: boolean;
    workspaces: IWorkspaceResponse[];
    showWorkspaceSelection: boolean;
    confirmedEmail: string | null;
    totalWorkspaces: number;
    /**
     * FormGroup instance representing the email and code form.
     * This is the common form structure used by all workspace auth components.
     */
    form: UntypedFormGroup;
    /**
     * Static method to build the common email/code form using Angular's FormBuilder.
     */
    static buildEmailCodeForm(fb: UntypedFormBuilder): UntypedFormGroup;
    /**
     * Getter for the email form control.
     */
    get email(): AbstractControl | null;
    /**
     * Getter for the code form control.
     */
    get code(): AbstractControl | null;
    constructor(translateService: TranslateService, _fb: UntypedFormBuilder, cdr: ChangeDetectorRef, _errorHandlingService: ErrorHandlingService, _store: Store, _workspaceAuthService: WorkspaceAuthService, _timerService: CountdownTimerService);
    ngOnDestroy(): void;
    /**
     * Sends the magic code for workspace authentication.
     * This method is shared across all workspace auth components.
     */
    sendSigninCode(): Promise<void>;
    /**
     * Resend the sign-in code.
     * This method is shared across all workspace auth components.
     */
    onResendCode(): Promise<void>;
    /**
     * Confirms the sign-in code and processes the response.
     * This method is shared but allows for different handling logic via the abstract method.
     */
    confirmSignInCode(): Promise<void>;
    /**
     * Abstract method to handle component-specific logic after confirmation response.
     * Each component will implement this differently based on their specific needs.
     */
    protected abstract handleConfirmationResponse(response: IUserSigninWorkspaceResponse): void;
    /**
     * Handle workspace selection - sign in to existing workspace.
     * This method is shared across all workspace auth components.
     */
    signInWorkspace(workspace: IWorkspaceResponse): Promise<void>;
    /**
     * Updates the store with workspace authentication data.
     * This method is shared across all workspace auth components.
     */
    protected updateStoreWithWorkspaceData(response: IAuthResponse): Promise<void>;
    /**
     * Close the current window/tab or redirect to main app.
     * This method is shared across all workspace auth components.
     */
    closeWindow(): void;
    /**
     * Track by function for workspace lists.
     * This method is shared across all workspace auth components.
     */
    trackByWorkspaceId: (_: number, w: IWorkspaceResponse) => string;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseWorkspaceAuthComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseWorkspaceAuthComponent, never, never, {}, {}, never, never, true, never>;
}
