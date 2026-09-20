import { Observable } from 'rxjs';
import { ISelectorVisibility } from './selector-builder-types';
import * as i0 from "@angular/core";
export declare const DEFAULT_SELECTOR_VISIBILITY: ISelectorVisibility;
export declare class SelectorBuilderService {
    private selectorsMapper;
    private _selectors$;
    selectors$: Observable<ISelectorVisibility>;
    /**
     * Sets the visibility of a selector by ID.
     *
     * @param id The ID of the selector.
     * @param value The visibility value.
     */
    setSelectorsVisibility(id: string, value: boolean): void;
    /**
     * Retrieves the visibility of all selectors and updates the BehaviorSubject.
     */
    getSelectorsVisibility(): void;
    /**
     * Retrieves the IDs of all selectors.
     * @returns An array of selector IDs.
     */
    getSelectorsIds(): string[];
    /**
     * Retrieves the visibility of a selector by ID.
     *
     * @param id The ID of the selector.
     * @returns The visibility of the selector.
     */
    getSelectorVisibilityById(id: string): boolean;
    /**
     * Retrieves the current state of the selectors by returning the value of the `_selectors$` BehaviorSubject.
     *
     * @return {ISelectorVisibility} The current state of the selectors.
     */
    getSelectors(): ISelectorVisibility;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectorBuilderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SelectorBuilderService>;
}
