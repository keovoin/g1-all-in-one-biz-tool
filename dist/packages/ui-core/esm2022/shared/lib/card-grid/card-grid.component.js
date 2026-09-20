import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, debounceTime, filter } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "ngx-infinite-scroll";
import * as i3 from "../smart-data-layout/no-data-message/no-data-message.component";
import * as i4 from "./card-grid-custom.component";
import * as i5 from "@angular/common";
import * as i6 from "@ngx-translate/core";
let CardGridComponent = class CardGridComponent {
    set source(content) {
        this.source$.next(content);
    }
    set grid(content) {
        if (content) {
            this._grid$.next(content);
        }
    }
    get grid() {
        return this._grid$.getValue();
    }
    get settings() {
        return this._settings;
    }
    set settings(settings) {
        this.setColumns(settings.columns);
        this._settings = settings;
    }
    set totalItems(content) {
        this._totalItems$.next(content);
    }
    constructor() {
        this.source$ = new BehaviorSubject([]);
        /**
         * The owning page's in-flight flag. Forwarded to the empty state so a grid
         * that has not received its first response yet shows card-shaped placeholders
         * instead of announcing that the user has no records.
         */
        this.loading = false;
        /** How many placeholder cards to draw while loading. */
        this.skeletonCards = 6;
        this.onSelectedItem = new EventEmitter();
        this.scroll = new EventEmitter();
        this.selected = { isSelected: false, data: null };
        this._grid$ = new BehaviorSubject(null);
        this._showMore = false;
        /*
         * Getter & Setter for dynamic columns settings
         */
        this._settings = {};
        /**
         * GRID defined columns
         */
        this.columns = [];
        this._totalItems$ = new BehaviorSubject(0);
    }
    getNoDataMessage() {
        return this.settings.noDataMessage;
    }
    getKeys() {
        return Object.keys(this.settings.columns);
    }
    setColumns(columns) {
        this.columns = columns;
    }
    getColumns() {
        return this.columns;
    }
    selectedItem(item) {
        this.selected =
            this.selected.data && item.id === this.selected.data.id
                ? { isSelected: !this.selected.isSelected, data: item }
                : { isSelected: true, data: item };
        this.onSelectedItem.emit(this.selected);
    }
    selectCustomViewComponent(component) {
        this._selectedCustomViewComponent = component;
    }
    customComponentInstance() {
        return this._selectedCustomViewComponent?.customComponent?.instance;
    }
    clearCustomViewComponent() {
        if (this._selectedCustomViewComponent) {
            this._selectedCustomViewComponent = null;
            this.selected = { isSelected: false, data: null };
        }
    }
    onScroll() {
        this.scroll.emit();
    }
    ngOnInit() {
        const source$ = this.source$.asObservable();
        const grid$ = this._grid$.asObservable();
        combineLatest([source$, grid$])
            .pipe(debounceTime(100), filter(([source, grid]) => !!grid && !!source), tap(([source]) => {
            this._arrayOverflow = this.totalItems <= source.length;
        }), tap(([, grid]) => (this.showMore = !this._hasScrollbar(grid))), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Retrieve the value of a given key from a row, optionally applying a value preparation function if defined.
     *
     * @param row - The data row object.
     * @param key - The key whose value needs to be retrieved.
     * @returns The prepared value or the raw value from the row.
     */
    getValue(row, key) {
        try {
            const columns = this.getColumns();
            if (key in columns) {
                const column = columns[key];
                const value = row[key];
                if (typeof column.valuePrepareFunction === 'function') {
                    return column.valuePrepareFunction.call(null, value, row);
                }
                return value;
            }
            throw new Error(`Key "${key}" not found in columns.`);
        }
        catch (error) {
            console.error('Error getting value:', error);
            return undefined;
        }
    }
    _hasScrollbar(grid) {
        return grid.nativeElement.scrollHeight > grid.nativeElement.clientHeight;
    }
    get showMore() {
        const size = this.source.length;
        return this._showMore && size >= 10 && !this._arrayOverflow;
    }
    set showMore(value) {
        this._showMore = value;
    }
    get source() {
        return this.source$.getValue();
    }
    get totalItems() {
        return this._totalItems$.getValue();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CardGridComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CardGridComponent, isStandalone: false, selector: "ga-card-grid", inputs: { source: "source", loading: "loading", skeletonCards: "skeletonCards", settings: "settings", totalItems: "totalItems" }, outputs: { onSelectedItem: "onSelectedItem", scroll: "scroll" }, viewQueries: [{ propertyName: "grid", first: true, predicate: ["grid"], descendants: true }], ngImport: i0, template: "@if (source && (source$ | async).length > 0) {\n\t<div class=\"card-layout grid-scroll-container\" infinite-scroll [scrollWindow]=\"false\" (scrolled)=\"onScroll()\" #grid>\n\t\t@for (item of source$ | async; track item) {\n\t\t\t<nb-card class=\"card-item\">\n\t\t\t\t<nb-card-body\n\t\t\t\t\t[class.card-body]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t[class.active]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t[class.card-body]=\"!(selected.isSelected && selected.data.id === item.id)\"\n\t\t\t\t\t(click)=\"selectedItem(item)\"\n\t\t\t\t>\n\t\t\t\t\t@for (key of getKeys(); track key) {\n\t\t\t\t\t\t<div class=\"info-line\">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tclass=\"info-meta\"\n\t\t\t\t\t\t\t\t[class.image-logo]=\"settings.columns[key].title === 'Image'\"\n\t\t\t\t\t\t\t\t[class.active]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ settings.columns[key].title }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tclass=\"info-value\"\n\t\t\t\t\t\t\t\t[class.image-logo]=\"settings.columns[key].title === 'Image'\"\n\t\t\t\t\t\t\t\t[class.active]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@switch (settings.columns[key].type) {\n\t\t\t\t\t\t\t\t\t@case ('html') {\n\t\t\t\t\t\t\t\t\t\t<div [innerHTML]=\"item[key]\"></div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@case ('date') {\n\t\t\t\t\t\t\t\t\t\t<div>{{ item[key] | date }}</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@case ('function') {\n\t\t\t\t\t\t\t\t\t\t<div>{{ item[key].name }}</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@case ('custom') {\n\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t<ga-custom-component\n\t\t\t\t\t\t\t\t\t\t\t\t#component\n\t\t\t\t\t\t\t\t\t\t\t\t[renderComponent]=\"settings.columns[key].renderComponent\"\n\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"item[key]\"\n\t\t\t\t\t\t\t\t\t\t\t\t[rowData]=\"item\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"custom\"\n\t\t\t\t\t\t\t\t\t\t\t\t(click)=\"selectCustomViewComponent(component)\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-custom-component>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@default {\n\t\t\t\t\t\t\t\t\t\t<div>{{ getValue(item, key) }}</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</nb-card-body>\n\t\t\t</nb-card>\n\t\t}\n\t\t<div class=\"show-more-button\">\n\t\t\t@if (showMore) {\n\t\t\t\t<button nbButton (click)=\"onScroll()\" status=\"basic\" size=\"small\" class=\"d-flex\">\n\t\t\t\t\t<nb-icon icon=\"arrowhead-down-outline\"></nb-icon>{{ 'BUTTONS.SHOW_MORE' | translate }}\n\t\t\t\t</button>\n\t\t\t}\n\t\t</div>\n\t</div>\n} @else {\n\t<div class=\"no-data\">\n\t\t<!--\n\t\t\t`loading` reaches the empty state instead of short-circuiting here, so\n\t\t\tthe placeholder it draws is card-shaped and the \"no records\" copy only\n\t\t\tappears once the page says the request is done.\n\t\t-->\n\t\t<ngx-no-data-message\n\t\t\t[message]=\"getNoDataMessage()\"\n\t\t\t[loading]=\"loading\"\n\t\t\tvariant=\"cards\"\n\t\t\t[skeletonRows]=\"skeletonCards\"\n\t\t></ngx-no-data-message>\n\t</div>\n}\n", styles: [":host{--gauzy-table-font-size: .8125rem;--gauzy-table-line-height: 1.25rem;--gauzy-table-cell-padding-y: .375rem;--gauzy-table-cell-padding-x: .625rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .9375rem;--gauzy-table-header-padding-y: .5rem;--gauzy-table-header-padding-x: .625rem;--gauzy-table-filter-padding-y: .25rem;--gauzy-table-control-height: 1.75rem;--gauzy-table-badge-height: 1.25rem;--gauzy-table-chip-font-size: .6875rem;--gauzy-table-chip-line-height: .875rem;--gauzy-table-chip-padding-y: .0625rem;--gauzy-table-chip-padding-x: .375rem;--gauzy-table-chip-gap: .1875rem;--gauzy-table-chip-block-gap: .25rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-table-badge-radius: initial;--gauzy-table-badge-padding-y: initial;--gauzy-people-chip-padding-y: initial}:host .card-layout{display:grid;grid-template-columns:repeat(auto-fill,minmax(21rem,1fr));-webkit-box-align:start;align-items:flex-start;-webkit-box-pack:start;justify-content:flex-start;column-gap:1rem;grid-gap:1rem;color:var(--color-basic-default);overflow-y:auto}[dir=ltr] :host .card-layout{padding-right:.5rem}[dir=rtl] :host .card-layout{padding-left:.5rem}:host .card-layout{max-height:100%}:host .card-layout .card-item{display:flex;flex-direction:column;margin-bottom:0;border-radius:.5rem;background-color:var(--background-basic-color-3);box-shadow:var(--gauzy-shadow);cursor:pointer}:host .card-layout .card-item .card-body{background-color:var(--background-basic-color-3);border-radius:.5rem;padding:12px 10px;display:flex;flex-direction:column;gap:4px}:host .card-layout .card-item .card-body.active{background:var(--color-primary-transparent-100)}:host .card-layout .card-item:hover{border-color:var(--color-primary-hover-border)}:host .card-layout .card-item:focus{border-color:var(--color-primary-focus-border)}:host .card-layout .card-item .info-line{display:flex;flex-direction:row;justify-content:space-between;font-size:.7em;width:100%;flex-grow:2;gap:4px}:host .card-layout .card-item .info-line .info-meta{background-color:var(--gauzy-card-1);padding:6px 10px;border-radius:4px;width:88%}:host .card-layout .card-item .info-line .info-meta.image-logo{display:none}:host .card-layout .card-item .info-line .info-meta.active{background-color:var(--gauzy-sidebar-background-4)}:host .card-layout .card-item .info-line .info-value{text-align:start;font-size:1em;background-color:var(--gauzy-card-1);padding:6px 10px;border-radius:4px;width:100%;position:relative}:host .card-layout .card-item .info-line .info-value.image-logo{background-color:unset;padding:0}:host .card-layout .card-item .info-line .info-value.active{background-color:var(--gauzy-sidebar-background-4)}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .img-container{width:100%}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .img-container img{height:132px;width:100%}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-notes-with-tags .tags-right,:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-only-tags .tags-right{justify-content:start}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-tags-color div{margin:0;position:inherit}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-tags-color div .color{width:100%}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-status-view{height:2rem;width:100%;position:absolute;left:0;bottom:0;margin:0}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-status-view .badge{position:absolute;height:2rem;width:100%;display:flex;align-items:center;justify-content:center}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-status-badge{width:100%;position:absolute;left:0;top:0;margin:0}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-status-badge .badge{height:2rem;display:flex;align-items:center;justify-content:center;font-size:var(--text-button-tiny-font-size);font-size:12px;font-weight:600;line-height:15px;letter-spacing:0em;text-align:left}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .progress-bar-container{width:100%;position:absolute;top:0;left:0;margin:0}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .progress-bar-container .paid-percent{display:flex;align-items:center;justify-content:center}:host .card-layout .card-item .info-line .info-value .custom::ng-deep li{font-size:1em}:host .card-layout .card-footer{justify-content:space-around;display:flex}:host{max-height:100%;height:100%}[dir=ltr] :host .no-data{padding-right:.625rem}[dir=rtl] :host .no-data{padding-left:.625rem}:host .no-data{height:100%}.show-more-button{height:100%;display:flex;align-items:center;justify-content:center}.show-more-button button{border-radius:var(--border-radius);border:none;box-shadow:var(--gauzy-shadow)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.InfiniteScrollDirective, selector: "[infiniteScroll], [infinite-scroll], [data-infinite-scroll]", inputs: ["infiniteScrollDistance", "infiniteScrollUpDistance", "infiniteScrollThrottle", "infiniteScrollDisabled", "infiniteScrollContainer", "scrollWindow", "immediateCheck", "horizontal", "alwaysCallback", "fromRoot"], outputs: ["scrolled", "scrolledUp"] }, { kind: "component", type: i3.NoDataMessageComponent, selector: "ngx-no-data-message", inputs: ["title", "message", "loading", "variant", "skeletonRows", "settleDelay"] }, { kind: "component", type: i4.CustomViewComponent, selector: "ga-custom-component", inputs: ["renderComponent", "value", "rowData"] }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.DatePipe, name: "date" }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
};
CardGridComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], CardGridComponent);
export { CardGridComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CardGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-card-grid', standalone: false, template: "@if (source && (source$ | async).length > 0) {\n\t<div class=\"card-layout grid-scroll-container\" infinite-scroll [scrollWindow]=\"false\" (scrolled)=\"onScroll()\" #grid>\n\t\t@for (item of source$ | async; track item) {\n\t\t\t<nb-card class=\"card-item\">\n\t\t\t\t<nb-card-body\n\t\t\t\t\t[class.card-body]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t[class.active]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t[class.card-body]=\"!(selected.isSelected && selected.data.id === item.id)\"\n\t\t\t\t\t(click)=\"selectedItem(item)\"\n\t\t\t\t>\n\t\t\t\t\t@for (key of getKeys(); track key) {\n\t\t\t\t\t\t<div class=\"info-line\">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tclass=\"info-meta\"\n\t\t\t\t\t\t\t\t[class.image-logo]=\"settings.columns[key].title === 'Image'\"\n\t\t\t\t\t\t\t\t[class.active]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ settings.columns[key].title }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tclass=\"info-value\"\n\t\t\t\t\t\t\t\t[class.image-logo]=\"settings.columns[key].title === 'Image'\"\n\t\t\t\t\t\t\t\t[class.active]=\"selected.isSelected && selected.data.id === item.id\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t@switch (settings.columns[key].type) {\n\t\t\t\t\t\t\t\t\t@case ('html') {\n\t\t\t\t\t\t\t\t\t\t<div [innerHTML]=\"item[key]\"></div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@case ('date') {\n\t\t\t\t\t\t\t\t\t\t<div>{{ item[key] | date }}</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@case ('function') {\n\t\t\t\t\t\t\t\t\t\t<div>{{ item[key].name }}</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@case ('custom') {\n\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t<ga-custom-component\n\t\t\t\t\t\t\t\t\t\t\t\t#component\n\t\t\t\t\t\t\t\t\t\t\t\t[renderComponent]=\"settings.columns[key].renderComponent\"\n\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"item[key]\"\n\t\t\t\t\t\t\t\t\t\t\t\t[rowData]=\"item\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"custom\"\n\t\t\t\t\t\t\t\t\t\t\t\t(click)=\"selectCustomViewComponent(component)\"\n\t\t\t\t\t\t\t\t\t\t\t></ga-custom-component>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t@default {\n\t\t\t\t\t\t\t\t\t\t<div>{{ getValue(item, key) }}</div>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</nb-card-body>\n\t\t\t</nb-card>\n\t\t}\n\t\t<div class=\"show-more-button\">\n\t\t\t@if (showMore) {\n\t\t\t\t<button nbButton (click)=\"onScroll()\" status=\"basic\" size=\"small\" class=\"d-flex\">\n\t\t\t\t\t<nb-icon icon=\"arrowhead-down-outline\"></nb-icon>{{ 'BUTTONS.SHOW_MORE' | translate }}\n\t\t\t\t</button>\n\t\t\t}\n\t\t</div>\n\t</div>\n} @else {\n\t<div class=\"no-data\">\n\t\t<!--\n\t\t\t`loading` reaches the empty state instead of short-circuiting here, so\n\t\t\tthe placeholder it draws is card-shaped and the \"no records\" copy only\n\t\t\tappears once the page says the request is done.\n\t\t-->\n\t\t<ngx-no-data-message\n\t\t\t[message]=\"getNoDataMessage()\"\n\t\t\t[loading]=\"loading\"\n\t\t\tvariant=\"cards\"\n\t\t\t[skeletonRows]=\"skeletonCards\"\n\t\t></ngx-no-data-message>\n\t</div>\n}\n", styles: [":host{--gauzy-table-font-size: .8125rem;--gauzy-table-line-height: 1.25rem;--gauzy-table-cell-padding-y: .375rem;--gauzy-table-cell-padding-x: .625rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .9375rem;--gauzy-table-header-padding-y: .5rem;--gauzy-table-header-padding-x: .625rem;--gauzy-table-filter-padding-y: .25rem;--gauzy-table-control-height: 1.75rem;--gauzy-table-badge-height: 1.25rem;--gauzy-table-chip-font-size: .6875rem;--gauzy-table-chip-line-height: .875rem;--gauzy-table-chip-padding-y: .0625rem;--gauzy-table-chip-padding-x: .375rem;--gauzy-table-chip-gap: .1875rem;--gauzy-table-chip-block-gap: .25rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-table-badge-radius: initial;--gauzy-table-badge-padding-y: initial;--gauzy-people-chip-padding-y: initial}:host .card-layout{display:grid;grid-template-columns:repeat(auto-fill,minmax(21rem,1fr));-webkit-box-align:start;align-items:flex-start;-webkit-box-pack:start;justify-content:flex-start;column-gap:1rem;grid-gap:1rem;color:var(--color-basic-default);overflow-y:auto}[dir=ltr] :host .card-layout{padding-right:.5rem}[dir=rtl] :host .card-layout{padding-left:.5rem}:host .card-layout{max-height:100%}:host .card-layout .card-item{display:flex;flex-direction:column;margin-bottom:0;border-radius:.5rem;background-color:var(--background-basic-color-3);box-shadow:var(--gauzy-shadow);cursor:pointer}:host .card-layout .card-item .card-body{background-color:var(--background-basic-color-3);border-radius:.5rem;padding:12px 10px;display:flex;flex-direction:column;gap:4px}:host .card-layout .card-item .card-body.active{background:var(--color-primary-transparent-100)}:host .card-layout .card-item:hover{border-color:var(--color-primary-hover-border)}:host .card-layout .card-item:focus{border-color:var(--color-primary-focus-border)}:host .card-layout .card-item .info-line{display:flex;flex-direction:row;justify-content:space-between;font-size:.7em;width:100%;flex-grow:2;gap:4px}:host .card-layout .card-item .info-line .info-meta{background-color:var(--gauzy-card-1);padding:6px 10px;border-radius:4px;width:88%}:host .card-layout .card-item .info-line .info-meta.image-logo{display:none}:host .card-layout .card-item .info-line .info-meta.active{background-color:var(--gauzy-sidebar-background-4)}:host .card-layout .card-item .info-line .info-value{text-align:start;font-size:1em;background-color:var(--gauzy-card-1);padding:6px 10px;border-radius:4px;width:100%;position:relative}:host .card-layout .card-item .info-line .info-value.image-logo{background-color:unset;padding:0}:host .card-layout .card-item .info-line .info-value.active{background-color:var(--gauzy-sidebar-background-4)}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .img-container{width:100%}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .img-container img{height:132px;width:100%}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-notes-with-tags .tags-right,:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-only-tags .tags-right{justify-content:start}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-tags-color div{margin:0;position:inherit}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-tags-color div .color{width:100%}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-status-view{height:2rem;width:100%;position:absolute;left:0;bottom:0;margin:0}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ngx-status-view .badge{position:absolute;height:2rem;width:100%;display:flex;align-items:center;justify-content:center}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-status-badge{width:100%;position:absolute;left:0;top:0;margin:0}:host .card-layout .card-item .info-line .info-value .custom::ng-deep ga-status-badge .badge{height:2rem;display:flex;align-items:center;justify-content:center;font-size:var(--text-button-tiny-font-size);font-size:12px;font-weight:600;line-height:15px;letter-spacing:0em;text-align:left}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .progress-bar-container{width:100%;position:absolute;top:0;left:0;margin:0}:host .card-layout .card-item .info-line .info-value .custom::ng-deep .progress-bar-container .paid-percent{display:flex;align-items:center;justify-content:center}:host .card-layout .card-item .info-line .info-value .custom::ng-deep li{font-size:1em}:host .card-layout .card-footer{justify-content:space-around;display:flex}:host{max-height:100%;height:100%}[dir=ltr] :host .no-data{padding-right:.625rem}[dir=rtl] :host .no-data{padding-left:.625rem}:host .no-data{height:100%}.show-more-button{height:100%;display:flex;align-items:center;justify-content:center}.show-more-button button{border-radius:var(--border-radius);border:none;box-shadow:var(--gauzy-shadow)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { source: [{
                type: Input
            }], loading: [{
                type: Input
            }], skeletonCards: [{
                type: Input
            }], onSelectedItem: [{
                type: Output
            }], scroll: [{
                type: Output
            }], grid: [{
                type: ViewChild,
                args: ['grid', { static: false }]
            }], settings: [{
                type: Input
            }], totalItems: [{
                type: Input
            }] } });
//# sourceMappingURL=card-grid.component.js.map