import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { of as ObservableOf } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { isEmpty } from '@gauzy/ui-core/common';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
import * as i1 from "../store/store.service";
let NavigationBuilderService = class NavigationBuilderService {
    constructor(store) {
        this.store = store;
        this.sidebarMapper = new Map();
        this._sidebars = [];
        this._addedActionBarItems = [];
        this.hasPermissions = (permissions) => {
            return permissions.every((p) => this.store.hasPermission(p));
        };
    }
    registerSidebar(id, config) {
        if (this.sidebarMapper.has(id)) {
            throw new Error(`A sidebar with the id "${id}" already exists`);
        }
        config = {
            id,
            ...config
        };
        this.sidebarMapper.set(id, config);
    }
    addSidebarActionItem(config) {
        this._addedActionBarItems.push({
            ...config
        });
    }
    getSidebarById(id) {
        if (!this.sidebarMapper.has(id)) {
            throw new Error(`No sidebar was found with the id "${id}"`);
        }
        return this.sidebarMapper.get(id);
    }
    getAvailableSidebarIds() {
        return [...this.sidebarMapper.entries()]
            .filter(([, config]) => {
            return isEmpty(config.permissions) || this.hasPermissions(config.permissions);
        })
            .map(([id]) => id);
    }
    getSidebarWidgets() {
        this._sidebars = this.getAvailableSidebarIds().map((id) => {
            return this.getSidebarById(id);
        });
        this.sidebars$ = ObservableOf(this._sidebars);
        this.sidebarActions$ = ObservableOf(this._addedActionBarItems);
    }
    clearSidebars() {
        this.sidebarMapper.clear();
    }
    clearActionBars() {
        this._addedActionBarItems = [];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NavigationBuilderService, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NavigationBuilderService, providedIn: 'root' }); }
};
NavigationBuilderService = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store])
], NavigationBuilderService);
export { NavigationBuilderService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NavigationBuilderService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Store }] });
//# sourceMappingURL=navigation-builder.service.js.map