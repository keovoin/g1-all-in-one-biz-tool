import { __decorate, __metadata } from "tslib";
/* It's a pagination component that works with the angular2-smart-table component */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalDataSource } from 'angular2-smart-table';
import { tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
let PaginationV2Component = class PaginationV2Component {
    constructor() {
        this._count = 0;
        this._changePage = new EventEmitter();
        this._perPageSelect = [5, 10, 25, 50, 100];
    }
    /**
     *
     * @param changes
     */
    _processPageChange(changes) {
        if (changes['action'] === 'prepend') {
            this._source.setPage(1);
        }
        if (changes['action'] === 'append') {
            this._source.setPage(this.last);
        }
    }
    /**
     * Init pages
     */
    _initPages() {
        const pagesCount = this.last;
        let showPagesCount = 4;
        showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
        this._pages = [];
        if (this.isShouldShow) {
            let middleOne = Math.ceil(showPagesCount / 2);
            middleOne = this._page >= middleOne ? this._page : middleOne;
            let lastOne = middleOne + Math.floor(showPagesCount / 2);
            lastOne = lastOne >= pagesCount ? pagesCount : lastOne;
            const firstOne = lastOne - showPagesCount + 1;
            for (let i = firstOne; i <= lastOne; i++) {
                this._pages.push(i);
            }
        }
    }
    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes) {
        if (changes.source) {
            if (!changes.source.firstChange) {
                this._dataChangedSub.unsubscribe();
            }
            this._dataChangedSub = this._source
                .onChanged()
                .pipe(tap((dataChanges) => {
                this._page = this._source.getPaging().page;
                this._perPage = this._source.getPaging().perPage;
                this._currentPerPage = this._perPage;
                this._count = this._source.count();
                if (this.isPageOutOfBounce) {
                    this._source.setPage(--this._page);
                }
                this._processPageChange(dataChanges);
                this._initPages();
            }), untilDestroyed(this))
                .subscribe();
        }
    }
    get isShouldShow() {
        return this._source.count() > this._perPage;
    }
    paginate(page) {
        this._source.setPage(page);
        this._page = page;
        this.changePage.emit({ page });
        return false;
    }
    next() {
        return this.paginate(this._page + 1);
    }
    prev() {
        return this.paginate(this._page - 1);
    }
    get last() {
        return Math.ceil(this._count / this._perPage);
    }
    get isPageOutOfBounce() {
        return this._page * this._perPage >= this._count + this._perPage && this._page > 1;
    }
    onChangePerPage(event) {
        this._currentPerPage = event;
        if (this._currentPerPage) {
            if (typeof this._currentPerPage === 'string' && this._currentPerPage.toLowerCase() === 'all') {
                this._source.getPaging().perPage = null;
            }
            else {
                this._source.getPaging().perPage = this._currentPerPage * 1;
                this._source.refresh();
            }
            this._initPages();
        }
    }
    get startCount() {
        return (this._page - 1) * this._perPage + 1;
    }
    get endCount() {
        const entriesEndPage = (this._page - 1) * this._perPage + this._perPage;
        if (entriesEndPage > this._count) {
            return this._count;
        }
        return entriesEndPage;
    }
    set source(value) {
        this._source = value;
    }
    get source() {
        return this._source;
    }
    set perPageSelect(values) {
        this._perPageSelect = values;
    }
    get perPageSelect() {
        return this._perPageSelect;
    }
    get currentPerPage() {
        return this._currentPerPage;
    }
    set currentPerPage(value) {
        this._currentPerPage = value;
    }
    get pages() {
        return this._pages;
    }
    set pages(value) {
        this._pages = value;
    }
    get page() {
        return this._page;
    }
    set page(value) {
        this._page = value;
    }
    get count() {
        return this._count;
    }
    set count(value) {
        this._count = value;
    }
    get perPage() {
        return this._perPage;
    }
    set perPage(value) {
        this._perPage = value;
    }
    get changePage() {
        return this._changePage;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaginationV2Component, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PaginationV2Component, isStandalone: false, selector: "ngx-pagination", inputs: { source: "source", perPageSelect: "perPageSelect" }, outputs: { changePage: "changePage" }, usesOnChanges: true, ngImport: i0, template: "@if (isShouldShow) {\n<nav class=\"d-flex justify-between align-items-center w-100\">\n\t<ul class=\"pagination mb-0\">\n\t\t<li (click)=\"page === 1 ? false : paginate(1)\">\n\t\t\t<a href=\"#\" aria-label=\"First\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-left-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">First</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"page === 1 ? false : prev()\" [class.disabled]=\"page === 1\">\n\t\t\t<a href=\"#\" aria-label=\"Prev\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Prev</span>\n\t\t\t</a>\n\t\t</li>\n\t\t@for (sheet of pages; track sheet) {\n\t\t<li [class.active]=\"sheet === page\">\n\t\t\t@if (sheet === page) {\n\t\t\t<span>{{ sheet }} <span class=\"sr-only\">(current)</span></span>\n\t\t\t} @if (page != sheet) {\n\t\t\t<span (click)=\"paginate(sheet)\">{{ sheet }}</span>\n\t\t\t}\n\t\t</li>\n\t\t}\n\t\t<li (click)=\"page === last ? false : next()\" [class.disabled]=\"page === last\">\n\t\t\t<a href=\"#\" aria-label=\"Next\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Next</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"page === last ? false : paginate(last)\">\n\t\t\t<a href=\"#\" aria-label=\"Last\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-right-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Last</span>\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\t@if (perPageSelect && perPageSelect.length > 0) {\n\t<div class=\"d-flex justify-between align-items-center\">\n\t\t<nb-select size=\"small\" (selectedChange)=\"onChangePerPage($event)\" [(selected)]=\"currentPerPage\">\n\t\t\t@for (item of perPageSelect; track item) {\n\t\t\t<nb-option [value]=\"item\">{{ item }}</nb-option>\n\t\t\t}\n\t\t</nb-select>\n\t\t<span> {{ startCount }} - {{ endCount }} of {{ count }} {{ 'PAGINATION.ITEMS' | translate }} </span>\n\t</div>\n\t}\n</nav>\n}\n", styles: ["@charset \"UTF-8\";:host a,:host span{display:block;margin:3px}:host a{pointer-events:none;text-decoration:none}:host li{cursor:pointer;overflow:hidden}:host li.active span{color:var(--text-primary-color);background-color:var(--background-basic-color-1);border-radius:50%;font-weight:600;padding:0!important;line-height:0;width:2.75rem;height:2.75rem;display:flex;justify-content:center;align-items:center}:host li span{font-size:.875rem;background-color:transparent;color:var(--text-basic-color);padding:.75rem 1.1rem;border:none}:host li span.icon{background:#ffffffbf;box-shadow:0 1px 1px #00000026;border-radius:var(--button-rectangle-border-radius);padding:.5rem;display:flex;align-items:center;justify-content:center}:host .pagination{font-size:.875rem;display:flex;align-items:center}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}nav{display:flex;justify-content:space-between}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
PaginationV2Component = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], PaginationV2Component);
export { PaginationV2Component };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaginationV2Component, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-pagination', standalone: false, template: "@if (isShouldShow) {\n<nav class=\"d-flex justify-between align-items-center w-100\">\n\t<ul class=\"pagination mb-0\">\n\t\t<li (click)=\"page === 1 ? false : paginate(1)\">\n\t\t\t<a href=\"#\" aria-label=\"First\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-left-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">First</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"page === 1 ? false : prev()\" [class.disabled]=\"page === 1\">\n\t\t\t<a href=\"#\" aria-label=\"Prev\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Prev</span>\n\t\t\t</a>\n\t\t</li>\n\t\t@for (sheet of pages; track sheet) {\n\t\t<li [class.active]=\"sheet === page\">\n\t\t\t@if (sheet === page) {\n\t\t\t<span>{{ sheet }} <span class=\"sr-only\">(current)</span></span>\n\t\t\t} @if (page != sheet) {\n\t\t\t<span (click)=\"paginate(sheet)\">{{ sheet }}</span>\n\t\t\t}\n\t\t</li>\n\t\t}\n\t\t<li (click)=\"page === last ? false : next()\" [class.disabled]=\"page === last\">\n\t\t\t<a href=\"#\" aria-label=\"Next\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Next</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li (click)=\"page === last ? false : paginate(last)\">\n\t\t\t<a href=\"#\" aria-label=\"Last\">\n\t\t\t\t<span class=\"icon\" aria-hidden=\"true\">\n\t\t\t\t\t<nb-icon status=\"primary\" icon=\"arrowhead-right-outline\"></nb-icon>\n\t\t\t\t</span>\n\t\t\t\t<span class=\"sr-only\">Last</span>\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\t@if (perPageSelect && perPageSelect.length > 0) {\n\t<div class=\"d-flex justify-between align-items-center\">\n\t\t<nb-select size=\"small\" (selectedChange)=\"onChangePerPage($event)\" [(selected)]=\"currentPerPage\">\n\t\t\t@for (item of perPageSelect; track item) {\n\t\t\t<nb-option [value]=\"item\">{{ item }}</nb-option>\n\t\t\t}\n\t\t</nb-select>\n\t\t<span> {{ startCount }} - {{ endCount }} of {{ count }} {{ 'PAGINATION.ITEMS' | translate }} </span>\n\t</div>\n\t}\n</nav>\n}\n", styles: ["@charset \"UTF-8\";:host a,:host span{display:block;margin:3px}:host a{pointer-events:none;text-decoration:none}:host li{cursor:pointer;overflow:hidden}:host li.active span{color:var(--text-primary-color);background-color:var(--background-basic-color-1);border-radius:50%;font-weight:600;padding:0!important;line-height:0;width:2.75rem;height:2.75rem;display:flex;justify-content:center;align-items:center}:host li span{font-size:.875rem;background-color:transparent;color:var(--text-basic-color);padding:.75rem 1.1rem;border:none}:host li span.icon{background:#ffffffbf;box-shadow:0 1px 1px #00000026;border-radius:var(--button-rectangle-border-radius);padding:.5rem;display:flex;align-items:center;justify-content:center}:host .pagination{font-size:.875rem;display:flex;align-items:center}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}nav{display:flex;justify-content:space-between}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { source: [{
                type: Input
            }], perPageSelect: [{
                type: Input
            }], changePage: [{
                type: Output
            }] } });
//# sourceMappingURL=pagination-v2.component.js.map