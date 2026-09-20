import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { cleanKeys, isNotEmpty, mergeDeep } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
let PaginationFilterBaseComponent = class PaginationFilterBaseComponent extends TranslationBaseComponent {
    get minItemPerPage() {
        return this._minItemPerPage;
    }
    get pagination() {
        return this._pagination;
    }
    set pagination(value) {
        this._pagination = value;
    }
    set filters(val) {
        this._filters = val;
    }
    get filters() {
        return this._filters;
    }
    constructor(translateService) {
        super(translateService);
        this.translateService = translateService;
        this.activePage = 1;
        this.totalItems = 0;
        this.itemsPerPage = 10;
        /**
         * Getter for minimum items per page
         * Can't be modified outside the class
         */
        this._minItemPerPage = 10;
        /**
         * Pagination
         */
        this._pagination = {
            totalItems: this.totalItems,
            activePage: this.activePage,
            itemsPerPage: this.itemsPerPage
        };
        this.pagination$ = new BehaviorSubject({
            activePage: this.pagination.activePage,
            itemsPerPage: this.pagination.itemsPerPage
        });
        this.subject$ = new Subject();
        /*
         * getter setter for filters
         */
        this._filters = {};
    }
    ngAfterViewInit() { }
    /*
     * refresh pagination
     */
    refreshPagination() {
        this.setPagination({
            ...this.getPagination(),
            activePage: this.activePage,
            itemsPerPage: this.minItemPerPage
        });
    }
    /**
     * Set filter for data based on the provided filter object.
     * @param filter - The filter object containing information about the field and search criteria.
     * @param doEmit - A boolean flag indicating whether to emit a notification after setting the filter. Default is true.
     */
    setFilter(filter, doEmit = true) {
        // Split the field path into an array of field names
        const fields = filter.field.split('.');
        // Check if the search criteria is not empty or a boolean
        if (isNotEmpty(filter.search) || 'boolean' === typeof filter.search) {
            const search = filter.search;
            // Create an object with nested keys representing the field path and set the search value
            const keys = fields.reduceRight((value, key) => ({ [key]: value }), search);
            // Update the 'where' property in the 'filters' object with the new keys
            this.filters = {
                where: {
                    ...this.filters.where,
                    ...keys,
                    ...mergeDeep(this.filters.where, keys)
                }
            };
        }
        else {
            // If the search criteria is empty or not a boolean, remove the field from the 'where' property
            const [field] = fields.reverse();
            cleanKeys(this.filters.where, field);
        }
        // Emit a notification if doEmit is true
        if (doEmit) {
            this.subject$.next(true);
        }
    }
    /**
     *
     * @param selectedPage
     */
    onPageChange(selectedPage) {
        this.setPagination({
            ...this.getPagination(),
            activePage: selectedPage
        });
        // Scroll to the table top
        this.scrollTop();
    }
    /**
     *
     */
    getPagination() {
        return this.pagination;
    }
    /**
     *
     */
    setPagination(pagination) {
        this.pagination = pagination;
        const { activePage, itemsPerPage } = this.getPagination();
        this.pagination$.next({ activePage, itemsPerPage });
    }
    /**
     *
     * @param itemsPerPage
     */
    onUpdateOption(itemsPerPage) {
        this.refreshPagination();
        this.pagination.itemsPerPage = itemsPerPage;
        this.setPagination({
            ...this.getPagination(),
            itemsPerPage: this.pagination.itemsPerPage
        });
    }
    /**
     * Scroll to the table top after set pagination
     */
    onScroll() {
        const activePage = this.pagination.activePage + 1;
        this.setPagination({
            ...this.getPagination(),
            activePage: activePage
        });
    }
    /**
     * Scroll to the table top after set pagination
     */
    scrollTop() {
        try {
            const table = document.querySelector('angular2-smart-table > table');
            if (!!table) {
                table.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        catch (error) {
            console.log('Error while scrolling to the table top', error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaginationFilterBaseComponent, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PaginationFilterBaseComponent, isStandalone: false, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
};
PaginationFilterBaseComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService])
], PaginationFilterBaseComponent);
export { PaginationFilterBaseComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaginationFilterBaseComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.TranslateService }] });
//# sourceMappingURL=pagination-filter-base.component.js.map