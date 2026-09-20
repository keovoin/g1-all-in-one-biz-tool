import { AfterViewInit, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IUser, IWorkSpace } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store, AuthService, ToastrService, WorkspaceResetService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class WorkspacesComponent extends TranslationBaseComponent implements AfterViewInit, OnInit {
    readonly translateService: TranslateService;
    private readonly store;
    private readonly authService;
    private readonly toastrService;
    private readonly workspaceResetService;
    private readonly nbMenuService;
    workspaces$: Observable<IWorkSpace[]>;
    selectedWorkspace$: Observable<IWorkSpace>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    /**
     * The workspaces this panel offers to SWITCH TO. The active one is already
     * named by the switcher that opens this panel, so listing it again read as a
     * duplicate entry rather than as "you are here".
     */
    otherWorkspaces$: Observable<IWorkSpace[]>;
    selected: IWorkSpace;
    contextMenus: NbMenuItem[];
    user: IUser;
    loading: boolean;
    error: string | null;
    constructor(translateService: TranslateService, store: Store, authService: AuthService, toastrService: ToastrService, workspaceResetService: WorkspaceResetService, nbMenuService: NbMenuService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Get workspaces - check store first, then load from API if needed
     */
    getWorkspaces(): void;
    /**
     * Applies translation changes by subscribing to the onLangChange observable provided by translateService.
     * When a language change occurs, it triggers the creation of context menus.
     *
     * @return {void} This function does not return a value.
     */
    private _applyTranslationOnChange;
    /**
     * Switches to the selected workspace with complete reset (logout/login approach).
     *
     * @param {IWorkSpace} workspace - The workspace to switch to.
     * @return {void} This function does not return a value.
     */
    onChangeWorkspace(workspace: IWorkSpace): void;
    /**
     * Create bulk action context menus
     */
    private _createContextMenus;
    /**
     * Setup menu click listener
     */
    private _setupMenuClickListener;
    /**
     * Open workspace action in new tab
     * @param action The action to perform (create, signin, find)
     */
    private openWorkspaceAction;
    /**
     * Create new workspace (legacy method - kept for compatibility)
     * @deprecated Use openWorkspaceAction('create') instead
     */
    add(): void;
    /**
     * Updates the local workspace state after a successful switch.
     *
     * @param {IWorkSpace} newWorkspace - The workspace that was switched to.
     * @return {void} This function does not return a value.
     */
    private updateLocalWorkspaceState;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspacesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkspacesComponent, "ngx-gauzy-workspaces", never, {}, {}, never, never, false, never>;
}
