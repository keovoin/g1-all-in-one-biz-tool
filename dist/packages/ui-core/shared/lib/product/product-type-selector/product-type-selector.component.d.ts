import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { IOrganization, IProductTypeTranslatable, IProductTypeTranslated } from '@gauzy/contracts';
import { Observable, Subject } from 'rxjs';
import { ErrorHandlingService, ProductTypeService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProductTypeSelectorComponent implements OnInit, OnDestroy {
    private readonly store;
    private readonly errorHandler;
    private readonly productTypeService;
    organization: IOrganization;
    protected subject$: Subject<any>;
    hasEditProductType$: Observable<boolean>;
    productTypes$: Observable<IProductTypeTranslated[]>;
    loading: boolean;
    private _disabled;
    get disabled(): boolean;
    set disabled(value: boolean);
    private _placeholder;
    get placeholder(): string;
    set placeholder(value: string);
    private _label;
    get label(): string;
    set label(value: string);
    private _addTag;
    get addTag(): boolean;
    set addTag(value: boolean);
    private _productTypeId;
    set productTypeId(val: IProductTypeTranslated['id']);
    get productTypeId(): IProductTypeTranslated['id'];
    /**
     * Getter & Setter for Product Type
     *
     */
    private _productType;
    set productType(val: IProductTypeTranslated);
    get productType(): IProductTypeTranslated;
    onChange: any;
    onTouched: any;
    onChanged: EventEmitter<IProductTypeTranslated>;
    onLoaded: EventEmitter<IProductTypeTranslated[]>;
    constructor(store: Store, errorHandler: ErrorHandlingService, productTypeService: ProductTypeService);
    ngOnInit(): void;
    writeValue(value: IProductTypeTranslated['id']): void;
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
    addProductType: (name: string) => Promise<IProductTypeTranslatable>;
    /**
     * GET product types
     *
     * @returns
     */
    getProductTypes(): Promise<void>;
    /**
     * On Change Product Type
     *
     * @param productType
     */
    selectProductType(productType: IProductTypeTranslated): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductTypeSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProductTypeSelectorComponent, "ngx-product-type-selector", never, { "disabled": { "alias": "disabled"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "label": { "alias": "label"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; }, { "onChanged": "onChanged"; "onLoaded": "onLoaded"; }, never, never, false, never>;
}
