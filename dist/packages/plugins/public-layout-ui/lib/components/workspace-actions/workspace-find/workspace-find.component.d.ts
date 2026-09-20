import { ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IUserSigninWorkspaceResponse } from '@gauzy/contracts';
import { ErrorHandlingService, Store, WorkspaceAuthService } from '@gauzy/ui-core/core';
import { BaseWorkspaceAuthComponent, CountdownTimerService } from '../shared';
import * as i0 from "@angular/core";
export declare class WorkspaceFindComponent extends BaseWorkspaceAuthComponent {
    readonly translateService: TranslateService;
    protected readonly _fb: UntypedFormBuilder;
    readonly cdr: ChangeDetectorRef;
    protected readonly _errorHandlingService: ErrorHandlingService;
    protected readonly _store: Store;
    protected readonly _workspaceAuthService: WorkspaceAuthService;
    protected readonly _timerService: CountdownTimerService;
    constructor(translateService: TranslateService, _fb: UntypedFormBuilder, cdr: ChangeDetectorRef, _errorHandlingService: ErrorHandlingService, _store: Store, _workspaceAuthService: WorkspaceAuthService, _timerService: CountdownTimerService);
    /**
     * Handle component-specific logic after confirmation response.
     * For workspace find: always show workspace selection if user has workspaces.
     */
    protected handleConfirmationResponse(response: IUserSigninWorkspaceResponse): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceFindComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkspaceFindComponent, "ga-workspace-find", never, {}, {}, never, never, false, never>;
}
