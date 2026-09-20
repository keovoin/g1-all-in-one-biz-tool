import { AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export interface IPaginationBase {
    totalItems?: number;
    activePage: number;
    itemsPerPage: number;
}
export declare class PaginationFilterBaseComponent extends TranslationBaseComponent implements AfterViewInit {
    readonly translateService: TranslateService;
    activePage: number;
    totalItems: number;
    itemsPerPage: number;
    /**
     * Getter for minimum items per page
     * Can't be modified outside the class
     */
    private _minItemPerPage;
    get minItemPerPage(): number;
    /**
     * Pagination
     */
    private _pagination;
    get pagination(): IPaginationBase;
    protected set pagination(value: IPaginationBase);
    protected pagination$: BehaviorSubject<IPaginationBase>;
    protected subject$: Subject<any>;
    protected _filters: any;
    set filters(val: any);
    get filters(): any;
    constructor(translateService: TranslateService);
    ngAfterViewInit(): void;
    protected refreshPagination(): void;
    /**
     * Set filter for data based on the provided filter object.
     * @param filter - The filter object containing information about the field and search criteria.
     * @param doEmit - A boolean flag indicating whether to emit a notification after setting the filter. Default is true.
     */
    protected setFilter(filter: any, doEmit?: boolean): void;
    /**
     *
     * @param selectedPage
     */
    onPageChange(selectedPage: number): void;
    /**
     *
     */
    protected getPagination(): IPaginationBase;
    /**
     *
     */
    protected setPagination(pagination: IPaginationBase): void;
    /**
     *
     * @param itemsPerPage
     */
    onUpdateOption(itemsPerPage: number): void;
    /**
     * Scroll to the table top after set pagination
     */
    onScroll(): void;
    /**
     * Scroll to the table top after set pagination
     */
    protected scrollTop(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PaginationFilterBaseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PaginationFilterBaseComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
