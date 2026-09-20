import { Injectable, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
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
export class BreadcrumbTailService {
    constructor() {
        this._keys = signal([], ...(ngDevMode ? [{ debugName: "_keys" }] : []));
        /** The current tail, outermost level first. */
        this.keys = this._keys.asReadonly();
        // A tail describes a state of the page currently on screen, so it can never
        // survive a navigation. Clearing here rather than leaving it to each page means
        // a page that forgets to clean up (or is torn down by a guard / an error) cannot
        // strand a stale crumb on the next page.
        inject(Router)
            .events.pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed())
            .subscribe(() => this._keys.set([]));
    }
    /**
     * Replaces the tail shown after the route-derived trail.
     *
     * @param keys i18n keys, outermost level first. Called with no arguments it clears the tail.
     */
    setTail(...keys) {
        this._keys.set(keys.filter((key) => !!key));
    }
    /** Drops the tail — the page is back to the state its URL describes. */
    clearTail() {
        this._keys.set([]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BreadcrumbTailService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BreadcrumbTailService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BreadcrumbTailService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=breadcrumb-tail.service.js.map