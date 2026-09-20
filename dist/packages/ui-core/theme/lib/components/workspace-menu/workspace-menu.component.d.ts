import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class WorkspaceMenuComponent implements OnInit, OnDestroy {
    close: EventEmitter<void>;
    /**
     * Whether an outside click is allowed to close this panel yet.
     *
     * The panel is created by the very click that opens it (the switcher in
     * `gauzy-logo.component.html`) and `gauzyOutside` listens on `document`, so
     * that opening click must never be the one that closes it again. Arming on a
     * timer defers it past the end of the current task, which is strictly later
     * than the opening click's propagation — that holds whether or not the
     * listener is registered in time to observe the opening click at all, so the
     * panel always survives opening and the very next outside click dismisses it.
     */
    private armed;
    private armTimer;
    ngOnInit(): void;
    ngOnDestroy(): void;
    onClick(): void;
    /**
     * `gauzyOutside` emits whether the click landed INSIDE this panel.
     *
     * This used to arm itself only on an inside click, which meant a user who
     * opened the switcher and then clicked anything else could never dismiss it:
     * the panel is absolutely positioned over the sidebar at z-index 1042 (see
     * `one-column.layout.scss`), so it swallowed every click on the menu items
     * underneath it — measured as 6 of 10 sidebar items unreachable while it was
     * stuck open, plus the lower edge of the header's "+ Create" button and the
     * first header combo box.
     */
    onClickOutside(clickedInside: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkspaceMenuComponent, "gauzy-workspace-menu", never, {}, { "close": "close"; }, never, never, false, never>;
}
