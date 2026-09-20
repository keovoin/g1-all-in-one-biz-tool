import { ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { SkeletonVariant } from '../../skeleton/skeleton.component';
import * as i0 from "@angular/core";
/**
 * How long a freshly created empty-state waits before it is allowed to claim
 * "No Data".
 *
 * This is the safety net for the ~50 call sites that do NOT pass `[loading]`:
 * every list page mounts with an empty array and only then fires its request,
 * so without a grace window the very first frame tells the user their data is
 * gone. Bounded by construction — the placeholder can never outlive it unless
 * `[loading]` is explicitly still true.
 */
export declare const NO_DATA_SETTLE_DELAY_MS = 700;
export declare class NoDataMessageComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly cdr;
    title: string;
    message: string;
    /**
     * The owning page's in-flight flag. While true the empty state is replaced by
     * a skeleton, because "we have not finished asking" is not the same statement
     * as "there is nothing here".
     */
    loading: boolean;
    /** Shape of the placeholder drawn while loading. */
    variant: SkeletonVariant;
    /** How many placeholder rows / cards to draw. */
    skeletonRows: number;
    /**
     * Grace window in ms. Pass 0 at call sites that are a genuine terminal state
     * (a 404-style "not found", a validation message) rather than a list result.
     */
    settleDelay: number;
    private settling;
    private settleTimer;
    constructor(translateService: TranslateService, cdr: ChangeDetectorRef);
    /** True while the request may still be in flight. */
    get showSkeleton(): boolean;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NoDataMessageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NoDataMessageComponent, "ngx-no-data-message", never, { "title": { "alias": "title"; "required": false; }; "message": { "alias": "message"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "variant": { "alias": "variant"; "required": false; }; "skeletonRows": { "alias": "skeletonRows"; "required": false; }; "settleDelay": { "alias": "settleDelay"; "required": false; }; }, {}, never, ["[message]"], false, never>;
}
