import { OnDestroy, OnInit } from '@angular/core';
import { IChangelog } from '@gauzy/contracts';
import { NbSidebarService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { ChangelogService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/** Tag of the Nebular sidebar this component is rendered into. */
export declare const CHANGELOG_SIDEBAR_TAG = "changelog_sidebar";
export declare class ChangelogComponent implements OnInit, OnDestroy {
    private readonly _changelogService;
    private readonly _sidebarService;
    items$: Observable<IChangelog[]>;
    /** Whether the panel is on screen, i.e. whether an outside click has anything to dismiss. */
    private state;
    constructor(_changelogService: ChangelogService, _sidebarService: NbSidebarService);
    ngOnInit(): void;
    /**
     * Read the panel's current state. `take(1)` is what makes this safe to call repeatedly:
     * `getSidebarState()` returns a ReplaySubject that receives exactly one value.
     */
    private syncState;
    /**
     * Collapses rather than toggles: this is only ever called to close the panel,
     * from the X button and from a click outside it.
     */
    closeSidebar(): void;
    /** `gauzyOutside` emits whether the click landed INSIDE the host, not outside it. */
    onClickOutside(clickedInside: boolean): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChangelogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChangelogComponent, "ngx-changelog", never, {}, {}, never, never, false, never>;
}
