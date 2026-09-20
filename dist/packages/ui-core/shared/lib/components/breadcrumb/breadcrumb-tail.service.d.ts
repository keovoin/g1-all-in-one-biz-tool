import { Signal } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Extra breadcrumb levels a page appends to the route-derived trail.
 *
 * `BreadcrumbComponent` builds its trail from the URL, which is the right source for
 * everything the router knows about. It cannot describe a step a page enters WITHOUT
 * navigating — the contacts pages, for instance, swap their table for the add/edit
 * wizard in place, so the URL still says `/pages/contacts/leads` while the screen shows
 * a form. The trail then stops one level short of where the user actually is.
 *
 * Entries are i18n KEYS rather than finished strings: the breadcrumb component
 * re-resolves the whole trail whenever the language (or the loaded bundle) changes, and
 * a pre-translated label would be the one crumb that stayed in the previous language.
 */
export declare class BreadcrumbTailService {
    private readonly _keys;
    /** The current tail, outermost level first. */
    readonly keys: Signal<string[]>;
    constructor();
    /**
     * Replaces the tail shown after the route-derived trail.
     *
     * @param keys i18n keys, outermost level first. Called with no arguments it clears the tail.
     */
    setTail(...keys: string[]): void;
    /** Drops the tail — the page is back to the state its URL describes. */
    clearTail(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BreadcrumbTailService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BreadcrumbTailService>;
}
