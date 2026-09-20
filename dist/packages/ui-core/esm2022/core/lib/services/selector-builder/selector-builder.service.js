import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export const DEFAULT_SELECTOR_VISIBILITY = {
    organization: true,
    date: true,
    employee: true,
    project: true,
    team: true
};
export class SelectorBuilderService {
    constructor() {
        this.selectorsMapper = new Map();
        this._selectors$ = new BehaviorSubject(DEFAULT_SELECTOR_VISIBILITY);
        this.selectors$ = this._selectors$.asObservable();
    }
    /**
     * Sets the visibility of a selector by ID.
     *
     * @param id The ID of the selector.
     * @param value The visibility value.
     */
    setSelectorsVisibility(id, value) {
        this.selectorsMapper.set(id, value);
    }
    /**
     * Retrieves the visibility of all selectors and updates the BehaviorSubject.
     */
    getSelectorsVisibility() {
        const selectors = {};
        this.getSelectorsIds().forEach((id) => {
            selectors[id] = this.getSelectorVisibilityById(id);
        });
        this._selectors$.next(selectors);
    }
    /**
     * Retrieves the IDs of all selectors.
     * @returns An array of selector IDs.
     */
    getSelectorsIds() {
        return [...this.selectorsMapper.entries()].map(([id]) => id);
    }
    /**
     * Retrieves the visibility of a selector by ID.
     *
     * @param id The ID of the selector.
     * @returns The visibility of the selector.
     */
    getSelectorVisibilityById(id) {
        if (!this.selectorsMapper.has(id)) {
            throw new Error(`No selector was found with the id "${id}"`);
        }
        return this.selectorsMapper.get(id);
    }
    /**
     * Retrieves the current state of the selectors by returning the value of the `_selectors$` BehaviorSubject.
     *
     * @return {ISelectorVisibility} The current state of the selectors.
     */
    getSelectors() {
        return this._selectors$.getValue();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorBuilderService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorBuilderService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SelectorBuilderService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=selector-builder.service.js.map