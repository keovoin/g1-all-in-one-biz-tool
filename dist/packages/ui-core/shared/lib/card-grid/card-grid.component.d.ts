import { OnDestroy, OnInit, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomViewComponent } from './card-grid-custom.component';
import * as i0 from "@angular/core";
export declare class CardGridComponent implements OnInit, OnDestroy {
    source$: BehaviorSubject<any>;
    set source(content: any);
    /**
     * The owning page's in-flight flag. Forwarded to the empty state so a grid
     * that has not received its first response yet shows card-shaped placeholders
     * instead of announcing that the user has no records.
     */
    loading: boolean;
    /** How many placeholder cards to draw while loading. */
    skeletonCards: number;
    onSelectedItem: EventEmitter<any>;
    scroll: EventEmitter<any>;
    selected: any;
    private _grid$;
    set grid(content: ElementRef);
    get grid(): ElementRef;
    private _showMore;
    private _selectedCustomViewComponent;
    _settings: any;
    get settings(): any;
    set settings(settings: any);
    /**
     * GRID defined columns
     */
    columns: any;
    _totalItems$: BehaviorSubject<number>;
    set totalItems(content: any);
    private _arrayOverflow;
    constructor();
    getNoDataMessage(): any;
    getKeys(): string[];
    setColumns(columns: []): void;
    getColumns(): any;
    selectedItem(item: any): void;
    selectCustomViewComponent(component: CustomViewComponent): void;
    customComponentInstance<T>(): T;
    clearCustomViewComponent(): void;
    onScroll(): void;
    ngOnInit(): void;
    /**
     * Retrieve the value of a given key from a row, optionally applying a value preparation function if defined.
     *
     * @param row - The data row object.
     * @param key - The key whose value needs to be retrieved.
     * @returns The prepared value or the raw value from the row.
     */
    getValue(row: any, key: string): any;
    private _hasScrollbar;
    get showMore(): boolean;
    set showMore(value: boolean);
    get source(): any;
    get totalItems(): any;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CardGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CardGridComponent, "ga-card-grid", never, { "source": { "alias": "source"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "skeletonCards": { "alias": "skeletonCards"; "required": false; }; "settings": { "alias": "settings"; "required": false; }; "totalItems": { "alias": "totalItems"; "required": false; }; }, { "onSelectedItem": "onSelectedItem"; "scroll": "scroll"; }, never, never, false, never>;
}
