import { ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { IDocsSavedView } from '../../models/docs-saved-view.model';
import { DocsSavedViewsService } from '../../services/docs-saved-views.service';
import * as i0 from "@angular/core";
/**
 * Saved filter views control in the filter bar (`01-ux-spec.md` §5, M5).
 *
 * Device-local only: the service writes `localStorage` and nothing here talks to
 * the API. The component owns just the popover UI — save current view, apply,
 * rename, delete — and emits the query-param patch the browse page merges into
 * the URL, keeping §5.1's "URL is the single source of truth" contract intact.
 *
 * The panel is `position: fixed` and measured off the trigger on open (and on
 * any scroll or resize while open), so it takes part in no ancestor's overflow,
 * stays clamped into the viewport and flips above the trigger when the room
 * below runs out.
 */
export declare class SavedViewsComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly savedViews;
    private readonly host;
    /** Current URL query params — what "Save current view" captures. */
    params: Params;
    /** Emits the merge patch that applies a view (see `toApplyPatch`). */
    applyView: EventEmitter<Params>;
    private triggerRef?;
    views: IDocsSavedView[];
    open: boolean;
    draftName: string;
    /** Id of the row currently being renamed inline (null = none). */
    renamingId: string | null;
    renameDraft: string;
    /** Resolved `position: fixed` box for the panel. */
    panelStyle: Record<string, string>;
    readonly nameMaxLength = 60;
    readonly limit = 20;
    /** Registered in the capture phase: scroll does not bubble to `window`. */
    private readonly onAnyScroll;
    constructor(translateService: TranslateService, savedViews: DocsSavedViewsService, host: ElementRef<HTMLElement>);
    ngOnInit(): void;
    ngOnDestroy(): void;
    toggle(): void;
    /** An outside click closes the panel. */
    onDocumentClick(event: Event): void;
    onEscape(): void;
    reposition(): void;
    get atLimit(): boolean;
    /** True when the given view describes exactly the filters currently in the URL. */
    isActive(view: IDocsSavedView): boolean;
    /** Label for the trigger button: the matching view's name, or the generic label. */
    get activeLabel(): string;
    save(): void;
    apply(view: IDocsSavedView): void;
    startRename(view: IDocsSavedView, event: Event): void;
    commitRename(view: IDocsSavedView): void;
    cancelRename(): void;
    remove(view: IDocsSavedView, event: Event): void;
    trackView(_: number, view: IDocsSavedView): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<SavedViewsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SavedViewsComponent, "gz-docs-saved-views", never, { "params": { "alias": "params"; "required": false; }; }, { "applyView": "applyView"; }, never, never, false, never>;
}
