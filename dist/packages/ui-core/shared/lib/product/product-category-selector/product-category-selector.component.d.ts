import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { IOrganization, IProductCategoryTranslatable, IProductCategoryTranslated } from '@gauzy/contracts';
import { Observable, Subject } from 'rxjs';
import { ProductCategoryService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProductCategorySelectorComponent implements OnInit, OnDestroy {
    private readonly store;
    private readonly productCategoryService;
    organization: IOrganization;
    protected subject$: Subject<any>;
    hasEditProductCategory$: Observable<boolean>;
    productCategories$: Observable<IProductCategoryTranslated[]>;
    loading: boolean;
    private _disabled;
    get disabled(): boolean;
    set disabled(value: boolean);
    private _placeholder;
    get placeholder(): string;
    set placeholder(value: string);
    private _addTag;
    get addTag(): boolean;
    set addTag(value: boolean);
    private _label;
    get label(): string;
    set label(value: string);
    private _productCategoryId;
    set productCategoryId(val: IProductCategoryTranslated['id']);
    get productCategoryId(): IProductCategoryTranslated['id'];
    /**
     * Getter & Setter for Product Type
     *
     */
    private _productCategory;
    set productCategory(val: IProductCategoryTranslated);
    get productCategory(): IProductCategoryTranslated;
    onChange: any;
    onTouched: any;
    onChanged: EventEmitter<IProductCategoryTranslated>;
    onLoaded: EventEmitter<IProductCategoryTranslated[]>;
    constructor(store: Store, productCategoryService: ProductCategoryService);
    ngOnInit(): void;
    writeValue(value: IProductCategoryTranslated['id']): void;
    /**
     * Register a listener for change events.
     */
    registerOnChange(fn: () => void): void;
    /**
     * Register a listener for touched events.
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Set disabled state for DOM element
     *
     * @param isDisabled
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Add product type using add tag
     *
     * @param name
     * @returns
     */
    addProductCategory: (name: string) => Promise<IProductCategoryTranslatable>;
    /**
     * GET product categories
     *
     * @returns
     */
    getProductCategories(): Promise<void>;
    /**
     * On Change Product Type
     *
     * @param productCategory
     */
    selectProductCategory(productCategory: IProductCategoryTranslated): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductCategorySelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProductCategorySelectorComponent, "ngx-product-category-selector", never, { "disabled": { "alias": "disabled"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; "label": { "alias": "label"; "required": false; }; }, { "onChanged": "onChanged"; "onLoaded": "onLoaded"; }, never, never, false, never>;
}
