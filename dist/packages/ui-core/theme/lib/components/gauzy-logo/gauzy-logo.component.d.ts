import { OnDestroy, OnInit, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NbThemeService } from '@nebular/theme';
import { Environment } from '@gauzy/ui-config';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class GauzyLogoComponent implements AfterViewInit, OnInit, OnDestroy {
    private readonly _themeService;
    private readonly _domSanitizer;
    private readonly _cd;
    private readonly _store;
    private readonly environment;
    theme: string;
    isCollapse: boolean;
    logoUrl: SafeResourceUrl;
    /** Active tenant (workspace) shown by the sidebar switcher. */
    tenantName: string;
    tenantLogo: string;
    private _controlled;
    get controlled(): boolean;
    set controlled(value: boolean);
    isAccordion: boolean;
    /**
     * Whether the workspace panel is currently open.
     *
     * Owned by the parent layout, which is what actually renders the panel
     * (`@if (isWorkspaceOpen())` in `one-column.layout.html`). This used to be a
     * private boolean flipped only by `toggleWorkspace()`, which went stale as
     * soon as the panel closed itself on an outside click — the switcher then
     * still believed it was open and the next click on it emitted `false`, so
     * the panel did not reopen and the click read as dead. Reading the parent's
     * state keeps one source of truth.
     */
    isWorkspaceOpen: boolean;
    onCollapsed: EventEmitter<boolean>;
    onWorkspaceToggle: EventEmitter<boolean>;
    /**
     * Checks if the logo file is in SVG format.
     * @returns {boolean} True if the logo ends with '.svg' (case-insensitive), false otherwise.
     */
    isSVG(): boolean;
    constructor(_themeService: NbThemeService, _domSanitizer: DomSanitizer, _cd: ChangeDetectorRef, _store: Store, environment: Environment);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Handles the collapse state of the accordion.
     * @param isCollapsed - The new collapsed state of the accordion.
     */
    onCollapse(isCollapsed: boolean): void;
    /**
     * Toggles the workspace dropdown.
     */
    toggleWorkspace(): void;
    /**
     * Navigates to the home page.
     * @returns false to prevent default behavior, if needed.
     */
    navigateHome(): boolean;
    /**
     * Determines if the logo should have the 'white-svg' class.
     * @returns true if isSVG is true and the theme is dark; otherwise, false.
     */
    isWhiteSvg(): boolean;
    /**
     * Checks if the current theme is a dark theme.
     * @returns true if the theme is dark; otherwise, false.
     */
    isDarkTheme(): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GauzyLogoComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GauzyLogoComponent, "ngx-gauzy-logo", never, { "controlled": { "alias": "controlled"; "required": false; }; "isAccordion": { "alias": "isAccordion"; "required": false; }; "isWorkspaceOpen": { "alias": "isWorkspaceOpen"; "required": false; }; }, { "onCollapsed": "onCollapsed"; "onWorkspaceToggle": "onWorkspaceToggle"; }, never, never, false, never>;
}
