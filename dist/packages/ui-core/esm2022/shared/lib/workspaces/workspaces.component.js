import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { debounceTime, filter, tap, catchError, finalize, map } from 'rxjs/operators';
import { EMPTY, of, combineLatest } from 'rxjs';
import { NbMenuService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, AuthService, ToastrService, WorkspaceResetService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
import * as i4 from "@angular/common";
let WorkspacesComponent = class WorkspacesComponent extends TranslationBaseComponent {
    constructor(translateService, store, authService, toastrService, workspaceResetService, nbMenuService) {
        super(translateService);
        this.translateService = translateService;
        this.store = store;
        this.authService = authService;
        this.toastrService = toastrService;
        this.workspaceResetService = workspaceResetService;
        this.nbMenuService = nbMenuService;
        this.workspaces$ = this.store.workspaces$;
        this.selectedWorkspace$ = this.store.selectedWorkspace$;
        this.loading$ = this.store.workspacesLoading$;
        this.error$ = this.store.workspacesError$;
        /**
         * The workspaces this panel offers to SWITCH TO. The active one is already
         * named by the switcher that opens this panel, so listing it again read as a
         * duplicate entry rather than as "you are here".
         */
        this.otherWorkspaces$ = combineLatest([
            this.store.workspaces$,
            this.store.selectedWorkspace$
        ]).pipe(map(([workspaces, selected]) => (workspaces ?? []).filter((workspace) => workspace.id !== selected?.id)));
        this.loading = false;
        this.error = null;
    }
    ngOnInit() {
        this._createContextMenus();
        this._applyTranslationOnChange();
        this._setupMenuClickListener();
    }
    ngAfterViewInit() {
        this.store.user$
            .pipe(debounceTime(100), distinctUntilChange(), filter((user) => !!user), tap((user) => (this.user = user)), tap(() => this.getWorkspaces()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Get workspaces - check store first, then load from API if needed
     */
    getWorkspaces() {
        if (!this.user?.id) {
            return;
        }
        // Check if workspaces are already loaded in the store
        const currentWorkspaces = this.store.workspaces;
        if (currentWorkspaces && currentWorkspaces.length > 0) {
            // Workspaces already loaded, just update selected workspace
            this.selected = this.store.selectedWorkspace || currentWorkspaces[0];
            return;
        }
        // Set loading state
        this.store.setWorkspacesLoading(true);
        this.authService
            .getUserWorkspaces(false)
            .pipe(tap(({ workspaces }) => {
            const mappedWorkspaces = workspaces.map((workspace) => ({
                id: workspace.user.tenant.id,
                name: workspace.user.tenant.name,
                imgUrl: workspace.user.tenant.logo || '/assets/images/default.svg',
                isOnline: true,
                isSelected: workspace.user.tenant.id === this.user.tenantId
            }));
            // Update store with workspaces
            this.store.setWorkspaces(mappedWorkspaces, this.user.tenantId);
            // Set the selected workspace locally for immediate UI update
            this.selected = mappedWorkspaces.find((w) => w.isSelected) || mappedWorkspaces[0];
        }), catchError(() => {
            this.store.setWorkspacesLoading(false, 'Failed to load workspaces');
            this.toastrService.danger('Failed to load workspaces', 'Error');
            return of({ workspaces: [], total_workspaces: 0 });
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Applies translation changes by subscribing to the onLangChange observable provided by translateService.
     * When a language change occurs, it triggers the creation of context menus.
     *
     * @return {void} This function does not return a value.
     */
    _applyTranslationOnChange() {
        this.translateService.onLangChange
            .pipe(tap(() => this._createContextMenus()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Switches to the selected workspace with complete reset (logout/login approach).
     *
     * @param {IWorkSpace} workspace - The workspace to switch to.
     * @return {void} This function does not return a value.
     */
    onChangeWorkspace(workspace) {
        if (workspace.id === this.selected?.id || this.loading) {
            return; // Already selected or loading
        }
        this.loading = true;
        this.error = null;
        // Use the workspace reset service (complete reset approach)
        this.workspaceResetService
            .switchWorkspace(workspace.id)
            .pipe(tap(() => {
            // Update local workspace state
            this.updateLocalWorkspaceState(workspace);
            // Note: Success notification is handled by the service
        }), catchError((error) => {
            console.error('Error switching workspace:', error);
            this.error = 'Failed to switch workspace';
            this.toastrService.danger('Failed to switch workspace. Please try again.', 'Error');
            return EMPTY;
        }), finalize(() => (this.loading = false)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Create bulk action context menus
     */
    _createContextMenus() {
        this.contextMenus = [
            {
                title: this.getTranslation('WORKSPACES.MENUS.SING_ANOTHER_WORKSPACE'),
                icon: 'person-add-outline',
                data: { action: 'signin' }
            },
            {
                title: this.getTranslation('WORKSPACES.MENUS.FIND_WORKSPACE'),
                icon: 'search-outline',
                data: { action: 'find' }
            },
            {
                title: this.getTranslation('WORKSPACES.MENUS.CREATE_NEW_WORKSPACE'),
                icon: 'plus-outline',
                data: { action: 'create' }
            }
        ];
    }
    /**
     * Setup menu click listener
     */
    _setupMenuClickListener() {
        this.nbMenuService
            .onItemClick()
            .pipe(
        // Filter to only events from this component's context menu
        filter(({ tag }) => tag === 'workspaces-menu'), map(({ item }) => item), untilDestroyed(this))
            .subscribe((item) => {
            const action = item.data?.action;
            if (action) {
                this.openWorkspaceAction(action);
            }
        });
    }
    /**
     * Open workspace action in new tab
     * @param action The action to perform (create, signin, find)
     */
    openWorkspaceAction(action) {
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/#/share/workspace/${action}`;
        // Open in new tab (not window)
        const newTab = window.open(url, '_blank');
        if (!newTab) {
            // Fallback: open in same tab
            window.location.href = url;
        }
    }
    /**
     * Create new workspace (legacy method - kept for compatibility)
     * @deprecated Use openWorkspaceAction('create') instead
     */
    add() {
        this.openWorkspaceAction('create');
    }
    /**
     * Updates the local workspace state after a successful switch.
     *
     * @param {IWorkSpace} newWorkspace - The workspace that was switched to.
     * @return {void} This function does not return a value.
     */
    updateLocalWorkspaceState(newWorkspace) {
        // Update workspace states using the store
        const currentWorkspaces = this.store.workspaces;
        const updatedWorkspaces = currentWorkspaces.map((w) => ({
            ...w,
            isSelected: w.id === newWorkspace.id,
            isOnline: w.id === newWorkspace.id ? true : w.isOnline
        }));
        // Update store with new workspace states
        this.store.setWorkspaces(updatedWorkspaces, newWorkspace.id);
        this.selected = { ...newWorkspace, isSelected: true };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspacesComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.AuthService }, { token: i2.ToastrService }, { token: i2.WorkspaceResetService }, { token: i3.NbMenuService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: WorkspacesComponent, isStandalone: false, selector: "ngx-gauzy-workspaces", usesInheritance: true, ngImport: i0, template: "<!-- Loading skeleton -->\n@if (loading$ | async) {\n<div class=\"skeleton-container\" role=\"status\" aria-live=\"polite\" aria-label=\"Loading workspaces\" aria-busy=\"true\">\n\t@for (item of [1, 2, 3]; track item) {\n\t<div class=\"workspace-skeleton-item\">\n\t\t<div class=\"skeleton-img-container\">\n\t\t\t<div class=\"skeleton-img\"></div>\n\t\t</div>\n\t\t<div class=\"skeleton-text\"></div>\n\t</div>\n\t}\n\t<div class=\"skeleton-add-workspace\">\n\t\t<div class=\"skeleton-add-btn\"></div>\n\t</div>\n</div>\n}\n\n<!-- Workspaces available to switch to \u2014 the active one is shown by the\n     switcher above, so it is deliberately absent here. -->\n@for (workspace of otherWorkspaces$ | async; track workspace.id) {\n<div>\n\t<div class=\"workspace-item\">\n\t\t<div class=\"img-container\">\n\t\t\t<img [src]=\"workspace.imgUrl\" alt=\"\" (click)=\"onChangeWorkspace(workspace)\" />\n\t\t\t@if (workspace.isOnline) {\n\t\t\t<div class=\"online-indicator\" aria-label=\"Online\"></div>\n\t\t\t}\n\t\t</div>\n\t\t<span class=\"workspace-name\" (click)=\"onChangeWorkspace(workspace)\">{{ workspace.name }}</span>\n\t</div>\n</div>\n}\n<div class=\"add-workspace-container\">\n\t<button\n\t\tclass=\"add-workspace-btn\"\n\t\t[nbContextMenu]=\"contextMenus\"\n\t\tnbContextMenuTag=\"workspaces-menu\"\n\t\tnbContextMenuPlacement=\"right\"\n\t\tnbButton\n\t\tghost\n\t>\n\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t</button>\n</div>\n", styles: ["div{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start;z-index:1050;cursor:pointer}div.workspace-item{border-radius:var(--border-radius);transition:background-color .2s ease}div .img-container{object-fit:cover;position:relative}div .img-container img{width:2.25rem;height:2.25rem;border-radius:.5rem;margin:0}div .img-container>div{position:absolute;width:10px;height:10px;background-color:#00d060;border-radius:8px;border:2px solid #ebebeb;right:0;top:0}div .workspace-name{font-size:.875rem;font-weight:500;padding-left:.5rem;color:var(--text-basic-color);cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.add-workspace-container{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start}.add-workspace-container .add-workspace-btn{width:2.25rem;height:2.25rem;border-radius:.5rem;border:2px dashed var(--border-basic-color-4);background:transparent;color:var(--text-hint-color);display:flex;align-items:center;justify-content:center;transition:all .2s ease;cursor:pointer}.add-workspace-container .add-workspace-btn:hover{border-color:var(--color-primary-default);color:var(--color-primary-default);background:var(--color-primary-transparent-hover)}.add-workspace-container .add-workspace-btn:active,.add-workspace-container .add-workspace-btn:focus{border-color:var(--color-primary-default);color:var(--color-primary-default);background:transparent;box-shadow:none;outline:none}.add-workspace-container .add-workspace-btn nb-icon{font-size:1rem}::ng-deep nb-context-menu{border-radius:8px;box-shadow:0 4px 12px #00000026;border:1px solid var(--border-basic-color-3);padding:8px;min-width:280px;max-width:320px;background:var(--background-basic-color-1)}::ng-deep nb-context-menu nb-menu .menu-item{border-width:0;margin:0 0 2px;border-radius:6px}::ng-deep nb-context-menu nb-menu .menu-item a{text-align:left;border-radius:6px;padding:10px 12px;display:flex;align-items:center;gap:12px;font-size:14px;color:var(--text-basic-color);transition:all .15s ease;text-decoration:none}::ng-deep nb-context-menu nb-menu .menu-item a:hover{background-color:var(--color-primary-transparent-hover);color:var(--text-basic-color)}::ng-deep nb-context-menu nb-menu .menu-item a:active{background-color:var(--color-primary-transparent-active)}::ng-deep nb-context-menu nb-menu .menu-item a nb-icon{min-width:32px;width:32px;height:32px;border-radius:6px;background-color:var(--background-basic-color-3);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-basic-color);flex-shrink:0}::ng-deep nb-context-menu nb-menu .menu-item a nb-icon svg{height:20px;width:20px}::ng-deep nb-context-menu nb-menu .menu-item a .menu-title{font-weight:400;line-height:1.4;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}::ng-deep nb-context-menu nb-menu .menu-item:last-child{margin-bottom:0}.skeleton-container{pointer-events:none;cursor:default;display:block}.skeleton-container .workspace-skeleton-item{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start;animation:skeleton-pulse 1.5s ease-in-out infinite}.skeleton-container .workspace-skeleton-item .skeleton-img-container{margin-right:.5rem}.skeleton-container .workspace-skeleton-item .skeleton-img-container .skeleton-img{width:2.25rem;height:2.25rem;border-radius:.5rem;background:linear-gradient(90deg,var(--background-basic-color-4) 25%,var(--background-basic-color-3) 50%,var(--background-basic-color-4) 75%);background-size:200% 100%;animation:skeleton-shimmer 2s infinite;will-change:background-position,opacity}.skeleton-container .workspace-skeleton-item .skeleton-text{height:.875rem;flex:1;max-width:120px;border-radius:4px;background:linear-gradient(90deg,var(--background-basic-color-4) 25%,var(--background-basic-color-3) 50%,var(--background-basic-color-4) 75%);background-size:200% 100%;animation:skeleton-shimmer 2s infinite;will-change:background-position,opacity}.skeleton-container .workspace-skeleton-item,.skeleton-container .skeleton-add-workspace{cursor:default}.skeleton-container .skeleton-add-workspace{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start}.skeleton-container .skeleton-add-workspace .skeleton-add-btn{width:2.25rem;height:2.25rem;border-radius:.5rem;border:2px dashed var(--border-basic-color-4);background:linear-gradient(90deg,transparent 25%,var(--background-basic-color-3) 50%,transparent 75%);background-size:200% 100%;animation:skeleton-shimmer 2s infinite}@keyframes skeleton-shimmer{0%{background-position:-200% 0}to{background-position:200% 0}}@keyframes skeleton-pulse{0%,to{opacity:1}50%{opacity:.7}}@media(prefers-reduced-motion:reduce){.skeleton-container .workspace-skeleton-item,.skeleton-container .skeleton-img,.skeleton-container .skeleton-text,.skeleton-container .skeleton-add-btn{animation:none!important}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i3.NbContextMenuDirective, selector: "[nbContextMenu]", inputs: ["nbContextMenuPlacement", "nbContextMenuAdjustment", "nbContextMenuTag", "nbContextMenu", "nbContextMenuTrigger", "nbContextMenuClass"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }] }); }
};
WorkspacesComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        AuthService,
        ToastrService,
        WorkspaceResetService,
        NbMenuService])
], WorkspacesComponent);
export { WorkspacesComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspacesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gauzy-workspaces', standalone: false, template: "<!-- Loading skeleton -->\n@if (loading$ | async) {\n<div class=\"skeleton-container\" role=\"status\" aria-live=\"polite\" aria-label=\"Loading workspaces\" aria-busy=\"true\">\n\t@for (item of [1, 2, 3]; track item) {\n\t<div class=\"workspace-skeleton-item\">\n\t\t<div class=\"skeleton-img-container\">\n\t\t\t<div class=\"skeleton-img\"></div>\n\t\t</div>\n\t\t<div class=\"skeleton-text\"></div>\n\t</div>\n\t}\n\t<div class=\"skeleton-add-workspace\">\n\t\t<div class=\"skeleton-add-btn\"></div>\n\t</div>\n</div>\n}\n\n<!-- Workspaces available to switch to \u2014 the active one is shown by the\n     switcher above, so it is deliberately absent here. -->\n@for (workspace of otherWorkspaces$ | async; track workspace.id) {\n<div>\n\t<div class=\"workspace-item\">\n\t\t<div class=\"img-container\">\n\t\t\t<img [src]=\"workspace.imgUrl\" alt=\"\" (click)=\"onChangeWorkspace(workspace)\" />\n\t\t\t@if (workspace.isOnline) {\n\t\t\t<div class=\"online-indicator\" aria-label=\"Online\"></div>\n\t\t\t}\n\t\t</div>\n\t\t<span class=\"workspace-name\" (click)=\"onChangeWorkspace(workspace)\">{{ workspace.name }}</span>\n\t</div>\n</div>\n}\n<div class=\"add-workspace-container\">\n\t<button\n\t\tclass=\"add-workspace-btn\"\n\t\t[nbContextMenu]=\"contextMenus\"\n\t\tnbContextMenuTag=\"workspaces-menu\"\n\t\tnbContextMenuPlacement=\"right\"\n\t\tnbButton\n\t\tghost\n\t>\n\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t</button>\n</div>\n", styles: ["div{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start;z-index:1050;cursor:pointer}div.workspace-item{border-radius:var(--border-radius);transition:background-color .2s ease}div .img-container{object-fit:cover;position:relative}div .img-container img{width:2.25rem;height:2.25rem;border-radius:.5rem;margin:0}div .img-container>div{position:absolute;width:10px;height:10px;background-color:#00d060;border-radius:8px;border:2px solid #ebebeb;right:0;top:0}div .workspace-name{font-size:.875rem;font-weight:500;padding-left:.5rem;color:var(--text-basic-color);cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.add-workspace-container{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start}.add-workspace-container .add-workspace-btn{width:2.25rem;height:2.25rem;border-radius:.5rem;border:2px dashed var(--border-basic-color-4);background:transparent;color:var(--text-hint-color);display:flex;align-items:center;justify-content:center;transition:all .2s ease;cursor:pointer}.add-workspace-container .add-workspace-btn:hover{border-color:var(--color-primary-default);color:var(--color-primary-default);background:var(--color-primary-transparent-hover)}.add-workspace-container .add-workspace-btn:active,.add-workspace-container .add-workspace-btn:focus{border-color:var(--color-primary-default);color:var(--color-primary-default);background:transparent;box-shadow:none;outline:none}.add-workspace-container .add-workspace-btn nb-icon{font-size:1rem}::ng-deep nb-context-menu{border-radius:8px;box-shadow:0 4px 12px #00000026;border:1px solid var(--border-basic-color-3);padding:8px;min-width:280px;max-width:320px;background:var(--background-basic-color-1)}::ng-deep nb-context-menu nb-menu .menu-item{border-width:0;margin:0 0 2px;border-radius:6px}::ng-deep nb-context-menu nb-menu .menu-item a{text-align:left;border-radius:6px;padding:10px 12px;display:flex;align-items:center;gap:12px;font-size:14px;color:var(--text-basic-color);transition:all .15s ease;text-decoration:none}::ng-deep nb-context-menu nb-menu .menu-item a:hover{background-color:var(--color-primary-transparent-hover);color:var(--text-basic-color)}::ng-deep nb-context-menu nb-menu .menu-item a:active{background-color:var(--color-primary-transparent-active)}::ng-deep nb-context-menu nb-menu .menu-item a nb-icon{min-width:32px;width:32px;height:32px;border-radius:6px;background-color:var(--background-basic-color-3);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-basic-color);flex-shrink:0}::ng-deep nb-context-menu nb-menu .menu-item a nb-icon svg{height:20px;width:20px}::ng-deep nb-context-menu nb-menu .menu-item a .menu-title{font-weight:400;line-height:1.4;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}::ng-deep nb-context-menu nb-menu .menu-item:last-child{margin-bottom:0}.skeleton-container{pointer-events:none;cursor:default;display:block}.skeleton-container .workspace-skeleton-item{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start;animation:skeleton-pulse 1.5s ease-in-out infinite}.skeleton-container .workspace-skeleton-item .skeleton-img-container{margin-right:.5rem}.skeleton-container .workspace-skeleton-item .skeleton-img-container .skeleton-img{width:2.25rem;height:2.25rem;border-radius:.5rem;background:linear-gradient(90deg,var(--background-basic-color-4) 25%,var(--background-basic-color-3) 50%,var(--background-basic-color-4) 75%);background-size:200% 100%;animation:skeleton-shimmer 2s infinite;will-change:background-position,opacity}.skeleton-container .workspace-skeleton-item .skeleton-text{height:.875rem;flex:1;max-width:120px;border-radius:4px;background:linear-gradient(90deg,var(--background-basic-color-4) 25%,var(--background-basic-color-3) 50%,var(--background-basic-color-4) 75%);background-size:200% 100%;animation:skeleton-shimmer 2s infinite;will-change:background-position,opacity}.skeleton-container .workspace-skeleton-item,.skeleton-container .skeleton-add-workspace{cursor:default}.skeleton-container .skeleton-add-workspace{margin-bottom:.375rem;display:flex;align-items:center;justify-content:flex-start}.skeleton-container .skeleton-add-workspace .skeleton-add-btn{width:2.25rem;height:2.25rem;border-radius:.5rem;border:2px dashed var(--border-basic-color-4);background:linear-gradient(90deg,transparent 25%,var(--background-basic-color-3) 50%,transparent 75%);background-size:200% 100%;animation:skeleton-shimmer 2s infinite}@keyframes skeleton-shimmer{0%{background-position:-200% 0}to{background-position:200% 0}}@keyframes skeleton-pulse{0%,to{opacity:1}50%{opacity:.7}}@media(prefers-reduced-motion:reduce){.skeleton-container .workspace-skeleton-item,.skeleton-container .skeleton-img,.skeleton-container .skeleton-text,.skeleton-container .skeleton-add-btn{animation:none!important}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.AuthService }, { type: i2.ToastrService }, { type: i2.WorkspaceResetService }, { type: i3.NbMenuService }] });
//# sourceMappingURL=workspaces.component.js.map