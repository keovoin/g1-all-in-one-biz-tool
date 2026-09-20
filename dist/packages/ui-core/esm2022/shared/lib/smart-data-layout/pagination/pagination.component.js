import { __decorate } from "tslib";
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
let PaginationComponent = class PaginationComponent {
    constructor() {
        /*
         * Getter & Setter for dynamic totalItems
         */
        this._totalItems = 1;
        /*
         * Getter & Setter for dynamic activePage
         */
        this._activePage = 1;
        /*
         * Getter & Setter for dynamic itemsPerPage
         */
        this._itemsPerPage = 5;
        /*
         * Getter & Setter for enable/disable emit EventEmitter
         */
        this._doEmit = true;
        this.subject$ = new Subject();
        this.selectedPage = new EventEmitter();
        this.selectedOption = new EventEmitter();
    }
    get totalItems() {
        return this._totalItems;
    }
    set totalItems(value) {
        this._totalItems = value;
    }
    get activePage() {
        return this._activePage;
    }
    set activePage(value) {
        this.subject$.next(value);
        this._activePage = value;
    }
    get itemsPerPage() {
        return this._itemsPerPage;
    }
    set itemsPerPage(value) {
        this.selectedOption.emit(value);
        this._itemsPerPage = value;
    }
    get doEmit() {
        return this._doEmit;
    }
    set doEmit(value) {
        this._doEmit = value;
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(200), distinctUntilChange(), // do not emit pagination on multiple click on same element,
        tap(() => this.selectedPage.emit(this.activePage)))
            .subscribe();
        // Do not emit pagination on multiple click on same element
        if (this.doEmit) {
            this.subject$.next(this.activePage);
        }
    }
    /**
     * Generates an array of page numbers to be displayed in the pagination.
     * The number of displayed pages is adjustable based on the current active page.
     *
     * @returns An array of page numbers.
     */
    getPages() {
        const totalPages = this.getPagesCount(); // Total number of pages
        const displayCount = 5; // Number of pages to display
        const effectiveDisplayCount = Math.min(totalPages, displayCount); // Ensure we don't exceed total pages
        const middlePage = Math.ceil(effectiveDisplayCount / 2); // Calculate middle page position
        // Determine the last page to display
        let lastPage = this.activePage >= middlePage
            ? Math.min(this.activePage + Math.floor(effectiveDisplayCount / 2), totalPages)
            : effectiveDisplayCount;
        // Determine the first page to display
        const firstPage = Math.max(lastPage - effectiveDisplayCount + 1, 1); // Ensure first page is at least 1
        // Generate the array of page numbers
        return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index);
    }
    /**
     * Calculates the starting index of the items on the current page.
     *
     * @returns The starting index of the items for the active page.
     */
    getStartPagesCount() {
        return (this.activePage - 1) * this.itemsPerPage + 1;
    }
    /**
     * Calculates the ending index of the items on the current page.
     *
     * @returns The ending index of the items for the active page, capped at the total number of items.
     */
    getEndPagesCount() {
        const entriesEndPage = (this.activePage - 1) * this.itemsPerPage + this.itemsPerPage;
        // Ensure the ending index does not exceed the total number of items
        return entriesEndPage > this.totalItems ? this.totalItems : entriesEndPage;
    }
    /**
     * Calculates the total number of pages based on the total items and items per page.
     *
     * @returns The total number of pages available.
     */
    getPagesCount() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }
    /**
     * Updates the active page index when the user changes the page.
     *
     * @param pageIdx - The index of the page to switch to.
     */
    onChangePage(pageIdx) {
        this.activePage = pageIdx;
    }
    /**
     * Handles the action of clicking the next page button.
     * Increments the active page by 1, unless it is already the last page.
     */
    onNextPageClick() {
        // Increment activePage or set it to the last page if already at the end
        this.activePage = this.activePage >= this.getPagesCount() ? this.getPagesCount() : this.activePage + 1;
        // Emit the updated active page
        this.subject$.next(this.activePage);
    }
    /**
     * Handles the action of clicking the previous page button.
     * Decrements the active page by 1, unless it is already the first page.
     */
    onPrevPageClick() {
        // Prevent decrementing if already on the first page
        if (this.activePage === 1)
            return;
        // Decrement activePage
        this.activePage--;
        // Emit the updated active page
        this.subject$.next(this.activePage);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaginationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PaginationComponent, isStandalone: false, selector: "ga-pagination", inputs: { totalItems: "totalItems", activePage: "activePage", itemsPerPage: "itemsPerPage", doEmit: "doEmit" }, outputs: { selectedPage: "selectedPage", selectedOption: "selectedOption" }, ngImport: i0, template: "<nav class=\"d-flex justify-between align-items-center w-100 mt-3\">\n\t<ul class=\"pagination mb-0\">\n\t\t<li (click)=\"onChangePage(1)\">\n\t\t\t<a href=\"#\" aria-label=\"First\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-left-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">First</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"onPrevPageClick()\" [class.disabled]=\"activePage == 1\">\n\t\t\t<a href=\"#\" aria-label=\"Prev\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Prev</span>\n\t\t\t</a>\n\t\t</li>\n\t\t@for (page of getPages(); track page) {\n\t\t<li (click)=\"onChangePage(page)\" [class.active]=\"activePage == page\">\n\t\t\t<span>{{ page }} <span class=\"sr-only\">(current)</span></span>\n\t\t</li>\n\t\t}\n\t\t<li (click)=\"onNextPageClick()\" [class.disabled]=\"activePage == getPages().length\">\n\t\t\t<a href=\"#\" aria-label=\"Next\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Next</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"onChangePage(getPagesCount())\">\n\t\t\t<a href=\"#\" aria-label=\"Last\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-right-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Last</span>\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\t<div class=\"d-flex justify-between align-items-center\">\n\t\t<nb-select size=\"small\" [(selected)]=\"itemsPerPage\">\n\t\t\t<nb-option [value]=\"5\">5</nb-option>\n\t\t\t<nb-option [value]=\"10\">10</nb-option>\n\t\t\t<nb-option [value]=\"25\">25</nb-option>\n\t\t\t<nb-option [value]=\"50\">50</nb-option>\n\t\t\t<nb-option [value]=\"100\">100</nb-option>\n\t\t</nb-select>\n\t\t<span>\n\t\t\t{{ getStartPagesCount() }} - {{ getEndPagesCount() }} of {{ totalItems }}\n\t\t\t{{ 'PAGINATION.ITEMS' | translate }}\n\t\t</span>\n\t</div>\n</nav>\n", styles: ["@charset \"UTF-8\";:host a,:host span{display:block;margin:3px}:host a{pointer-events:none;text-decoration:none}:host li{cursor:pointer;overflow:hidden}:host li.active span{color:var(--text-primary-color);background-color:var(--background-basic-color-1);border-radius:var(--button-rectangle-border-radius)}:host li span{font-size:.875rem;background-color:transparent;color:var(--text-basic-color);padding:.75rem 1.1rem;border:none}:host li span.icon{background:#ffffffbf;box-shadow:0 1px 1px #00000026;border-radius:var(--button-rectangle-border-radius);padding:.5rem;display:flex;align-items:center;justify-content:center}:host .pagination{font-size:.875rem;display:flex;align-items:center}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}nav{display:flex;justify-content:space-between}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
PaginationComponent = __decorate([
    UntilDestroy({ checkProperties: true })
], PaginationComponent);
export { PaginationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaginationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-pagination', standalone: false, template: "<nav class=\"d-flex justify-between align-items-center w-100 mt-3\">\n\t<ul class=\"pagination mb-0\">\n\t\t<li (click)=\"onChangePage(1)\">\n\t\t\t<a href=\"#\" aria-label=\"First\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-left-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">First</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"onPrevPageClick()\" [class.disabled]=\"activePage == 1\">\n\t\t\t<a href=\"#\" aria-label=\"Prev\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Prev</span>\n\t\t\t</a>\n\t\t</li>\n\t\t@for (page of getPages(); track page) {\n\t\t<li (click)=\"onChangePage(page)\" [class.active]=\"activePage == page\">\n\t\t\t<span>{{ page }} <span class=\"sr-only\">(current)</span></span>\n\t\t</li>\n\t\t}\n\t\t<li (click)=\"onNextPageClick()\" [class.disabled]=\"activePage == getPages().length\">\n\t\t\t<a href=\"#\" aria-label=\"Next\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Next</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"onChangePage(getPagesCount())\">\n\t\t\t<a href=\"#\" aria-label=\"Last\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-right-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Last</span>\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\t<div class=\"d-flex justify-between align-items-center\">\n\t\t<nb-select size=\"small\" [(selected)]=\"itemsPerPage\">\n\t\t\t<nb-option [value]=\"5\">5</nb-option>\n\t\t\t<nb-option [value]=\"10\">10</nb-option>\n\t\t\t<nb-option [value]=\"25\">25</nb-option>\n\t\t\t<nb-option [value]=\"50\">50</nb-option>\n\t\t\t<nb-option [value]=\"100\">100</nb-option>\n\t\t</nb-select>\n\t\t<span>\n\t\t\t{{ getStartPagesCount() }} - {{ getEndPagesCount() }} of {{ totalItems }}\n\t\t\t{{ 'PAGINATION.ITEMS' | translate }}\n\t\t</span>\n\t</div>\n</nav>\n", styles: ["@charset \"UTF-8\";:host a,:host span{display:block;margin:3px}:host a{pointer-events:none;text-decoration:none}:host li{cursor:pointer;overflow:hidden}:host li.active span{color:var(--text-primary-color);background-color:var(--background-basic-color-1);border-radius:var(--button-rectangle-border-radius)}:host li span{font-size:.875rem;background-color:transparent;color:var(--text-basic-color);padding:.75rem 1.1rem;border:none}:host li span.icon{background:#ffffffbf;box-shadow:0 1px 1px #00000026;border-radius:var(--button-rectangle-border-radius);padding:.5rem;display:flex;align-items:center;justify-content:center}:host .pagination{font-size:.875rem;display:flex;align-items:center}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}nav{display:flex;justify-content:space-between}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { totalItems: [{
                type: Input
            }], activePage: [{
                type: Input
            }], itemsPerPage: [{
                type: Input
            }], doEmit: [{
                type: Input
            }], selectedPage: [{
                type: Output
            }], selectedOption: [{
                type: Output
            }] } });
//# sourceMappingURL=pagination.component.js.map