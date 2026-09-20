import { EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class PaginationComponent implements OnInit {
    _totalItems: number;
    get totalItems(): number;
    set totalItems(value: number);
    _activePage: number;
    get activePage(): number;
    set activePage(value: number);
    _itemsPerPage: number;
    get itemsPerPage(): number;
    set itemsPerPage(value: number);
    _doEmit: boolean;
    get doEmit(): boolean;
    set doEmit(value: boolean);
    subject$: Subject<any>;
    selectedPage: EventEmitter<number>;
    selectedOption: EventEmitter<number>;
    ngOnInit(): void;
    /**
     * Generates an array of page numbers to be displayed in the pagination.
     * The number of displayed pages is adjustable based on the current active page.
     *
     * @returns An array of page numbers.
     */
    getPages(): number[];
    /**
     * Calculates the starting index of the items on the current page.
     *
     * @returns The starting index of the items for the active page.
     */
    getStartPagesCount(): number;
    /**
     * Calculates the ending index of the items on the current page.
     *
     * @returns The ending index of the items for the active page, capped at the total number of items.
     */
    getEndPagesCount(): number;
    /**
     * Calculates the total number of pages based on the total items and items per page.
     *
     * @returns The total number of pages available.
     */
    getPagesCount(): number;
    /**
     * Updates the active page index when the user changes the page.
     *
     * @param pageIdx - The index of the page to switch to.
     */
    onChangePage(pageIdx: number): void;
    /**
     * Handles the action of clicking the next page button.
     * Increments the active page by 1, unless it is already the last page.
     */
    onNextPageClick(): void;
    /**
     * Handles the action of clicking the previous page button.
     * Decrements the active page by 1, unless it is already the first page.
     */
    onPrevPageClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PaginationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PaginationComponent, "ga-pagination", never, { "totalItems": { "alias": "totalItems"; "required": false; }; "activePage": { "alias": "activePage"; "required": false; }; "itemsPerPage": { "alias": "itemsPerPage"; "required": false; }; "doEmit": { "alias": "doEmit"; "required": false; }; }, { "selectedPage": "selectedPage"; "selectedOption": "selectedOption"; }, never, never, false, never>;
}
