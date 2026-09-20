var BaseWorkspaceAuthComponent_1;
import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Directive } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { ALPHA_NUMERIC_CODE_LENGTH, patterns } from '@gauzy/constants';
import { ErrorHandlingService, Store, WorkspaceAuthService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CountdownTimerService } from './countdown-timer.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "./countdown-timer.service";
/**
 * Abstract base component for workspace authentication flows when user is already connected.
 * Contains shared functionality for magic code authentication, timer management,
 * and workspace selection that is common across workspace-create, workspace-signin, and workspace-find components.
 */
let BaseWorkspaceAuthComponent = class BaseWorkspaceAuthComponent extends TranslationBaseComponent {
    static { BaseWorkspaceAuthComponent_1 = this; }
    /**
     * Static method to build the common email/code form using Angular's FormBuilder.
     */
    static buildEmailCodeForm(fb) {
        return fb.group({
            email: [null, Validators.compose([Validators.required, Validators.pattern(patterns.email)])],
            code: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(ALPHA_NUMERIC_CODE_LENGTH),
                    Validators.maxLength(ALPHA_NUMERIC_CODE_LENGTH)
                ])
            ]
        });
    }
    /**
     * Getter for the email form control.
     */
    get email() {
        return this.form.get('email');
    }
    /**
     * Getter for the code form control.
     */
    get code() {
        return this.form.get('code');
    }
    constructor(translateService, _fb, cdr, _errorHandlingService, _store, _workspaceAuthService, _timerService) {
        super(translateService);
        this.translateService = translateService;
        this._fb = _fb;
        this.cdr = cdr;
        this._errorHandlingService = _errorHandlingService;
        this._store = _store;
        this._workspaceAuthService = _workspaceAuthService;
        this._timerService = _timerService;
        // Timer properties
        this.countdown = 0;
        // Code length constant exposed for templates
        this.codeLength = ALPHA_NUMERIC_CODE_LENGTH;
        // Loading and state properties
        this.isLoading = false;
        this.isCodeSent = false;
        this.isCodeResent = false;
        // Workspace selection state
        this.workspaces = [];
        this.showWorkspaceSelection = false;
        this.confirmedEmail = null;
        this.totalWorkspaces = 0;
        /**
         * Track by function for workspace lists.
         * This method is shared across all workspace auth components.
         */
        this.trackByWorkspaceId = (_, w) => w?.user?.tenant?.id || w?.user?.id;
        this.form = BaseWorkspaceAuthComponent_1.buildEmailCodeForm(this._fb);
        this._timerService.timerState$.pipe(untilDestroyed(this)).subscribe((state) => {
            this.countdown = state.countdown;
            this.isCodeResent = state.isResent;
            this.cdr.markForCheck();
        });
    }
    ngOnDestroy() {
        this._timerService.stopTimer();
    }
    /**
     * Sends the magic code for workspace authentication.
     * This method is shared across all workspace auth components.
     */
    async sendSigninCode() {
        if (this.isLoading) {
            return;
        }
        // Get the email value from the form
        const email = (this.form.get('email').value || '').trim();
        if (!email) {
            return;
        }
        try {
            this.isLoading = true;
            await this._workspaceAuthService.sendSigninCode(email);
            this.isCodeSent = true;
            this.cdr.markForCheck();
        }
        catch {
            this.isCodeSent = false;
            this.cdr.markForCheck();
        }
        finally {
            this.isLoading = false;
            this.cdr.markForCheck();
        }
    }
    /**
     * Resend the sign-in code.
     * This method is shared across all workspace auth components.
     */
    async onResendCode() {
        if (this.isLoading) {
            return;
        }
        // Get the email value from the form
        const email = (this.form.get('email')?.value || '').trim();
        // Check if email is present
        if (!email) {
            return;
        }
        if (this.countdown > 0) {
            return;
        }
        try {
            this.isLoading = true;
            await this._workspaceAuthService.sendSigninCode(email);
            this.isCodeResent = true;
            this._timerService.startTimer();
            this.cdr.markForCheck();
        }
        catch {
            this.isCodeResent = false;
            this._timerService.stopTimer();
            this.cdr.markForCheck();
        }
        finally {
            this.isLoading = false;
            this.cdr.markForCheck();
        }
    }
    /**
     * Confirms the sign-in code and processes the response.
     * This method is shared but allows for different handling logic via the abstract method.
     */
    async confirmSignInCode() {
        // Check if the form is invalid
        if (this.form.invalid) {
            return;
        }
        // Get the email and code values from the form
        const raw = this.form.getRawValue();
        const email = (raw.email || '').trim();
        const code = (raw.code || '').trim();
        // Check if both email and code are present
        if (!email || !code) {
            return;
        }
        try {
            this.isLoading = true;
            const response = await this._workspaceAuthService.confirmSignInByCode(email, code);
            // Store the confirmed email for later use
            this.confirmedEmail = email;
            // Store workspace data
            this.workspaces = response?.workspaces || [];
            this.totalWorkspaces = response?.total_workspaces ?? this.workspaces.length;
            // Call the abstract method to handle component-specific logic
            this.handleConfirmationResponse(response);
            // Show workspace selection if there are workspaces
            if (this.workspaces.length > 0) {
                this.showWorkspaceSelection = true;
            }
            this.cdr.markForCheck();
        }
        catch (error) {
            this._errorHandlingService.handleError(error);
            this.showWorkspaceSelection = false;
            this.cdr.markForCheck();
        }
        finally {
            this.isLoading = false;
            this.cdr.markForCheck();
        }
    }
    /**
     * Handle workspace selection - sign in to existing workspace.
     * This method is shared across all workspace auth components.
     */
    async signInWorkspace(workspace) {
        if (!workspace || !this.confirmedEmail) {
            return;
        }
        try {
            this.isLoading = true;
            const email = this.confirmedEmail;
            const token = workspace.token;
            // Sign in to the selected workspace
            await this._workspaceAuthService.signInWorkspaceByToken(email, token);
            // Close the window after successful signin
            this.closeWindow();
            this.cdr.markForCheck();
        }
        catch (error) {
            this._errorHandlingService.handleError(error);
            this.cdr.markForCheck();
        }
        finally {
            this.isLoading = false;
            this.cdr.markForCheck();
        }
    }
    /**
     * Updates the store with workspace authentication data.
     * This method is shared across all workspace auth components.
     */
    async updateStoreWithWorkspaceData(response) {
        await this._workspaceAuthService.updateStoreWithWorkspaceData(response);
    }
    /**
     * Close the current window/tab or redirect to main app.
     * This method is shared across all workspace auth components.
     */
    closeWindow() {
        window.location.href = '/';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseWorkspaceAuthComponent, deps: [{ token: i1.TranslateService }, { token: i2.UntypedFormBuilder }, { token: i0.ChangeDetectorRef }, { token: i3.ErrorHandlingService }, { token: i3.Store }, { token: i3.WorkspaceAuthService }, { token: i4.CountdownTimerService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: BaseWorkspaceAuthComponent, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
};
BaseWorkspaceAuthComponent = BaseWorkspaceAuthComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        UntypedFormBuilder,
        ChangeDetectorRef,
        ErrorHandlingService,
        Store,
        WorkspaceAuthService,
        CountdownTimerService])
], BaseWorkspaceAuthComponent);
export { BaseWorkspaceAuthComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseWorkspaceAuthComponent, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.UntypedFormBuilder }, { type: i0.ChangeDetectorRef }, { type: i3.ErrorHandlingService }, { type: i3.Store }, { type: i3.WorkspaceAuthService }, { type: i4.CountdownTimerService }] });
//# sourceMappingURL=base-workspace-auth.component.js.map