import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, of, Subject } from 'rxjs';
import { catchError, filter, startWith, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PermissionsEnum } from '@gauzy/contracts';
import { FavoriteService } from './favorite.service';
import { Store } from '../store/store.service';
import { ENTITY_ICONS, ENTITY_LINKS } from './entities-mapping';
import * as i0 from "@angular/core";
import * as i1 from "./favorite.service";
import * as i2 from "../store/store.service";
let FavoriteStoreService = class FavoriteStoreService {
    constructor(_favoriteService, _store) {
        this._favoriteService = _favoriteService;
        this._store = _store;
        this._favoriteItems$ = new BehaviorSubject([]);
        this.favoriteItems$ = this._favoriteItems$.asObservable();
        this._refresh$ = new Subject();
        this._listenToChangesAndLoadFavorites();
    }
    refreshFavorites() {
        this._refresh$.next();
    }
    _listenToChangesAndLoadFavorites() {
        this._favoriteSubscription = combineLatest([
            this._store.selectedOrganization$.pipe(filter((org) => !!org)),
            this._refresh$.pipe(startWith(null))
        ])
            .pipe(switchMap(() => from(this._loadFavorites())), catchError((error) => {
            console.error('Error loading favorites in store', error);
            this._favoriteItems$.next([]);
            return of([]);
        }), untilDestroyed(this))
            .subscribe((items) => {
            this._favoriteItems$.next(items);
        });
    }
    async _loadFavorites() {
        const { id: organizationId, tenantId } = this._store.selectedOrganization || {};
        if (!organizationId) {
            return [];
        }
        const isAdmin = this._store.hasAnyPermission(PermissionsEnum.ALL_ORG_VIEW);
        const employeeId = this._store.selectedEmployee?.id;
        let favoriteStubsPromise;
        if (isAdmin && !employeeId) {
            favoriteStubsPromise = this._favoriteService.findAll({
                where: { organizationId, tenantId }
            });
        }
        else {
            const targetEmployeeId = employeeId || this._store.user.employee?.id;
            if (!targetEmployeeId) {
                return [];
            }
            favoriteStubsPromise = this._favoriteService.findByEmployee({
                where: { organizationId, tenantId, employeeId: targetEmployeeId }
            });
        }
        const { items: favoriteStubs } = await favoriteStubsPromise;
        if (!favoriteStubs.length) {
            return [];
        }
        const groupedFavorites = favoriteStubs.reduce((acc, fav) => {
            (acc[fav.entity] = acc[fav.entity] || []).push(fav);
            return acc;
        }, {});
        const favoritePromises = [];
        for (const entityType of Object.keys(groupedFavorites)) {
            const promise = this._favoriteService
                .getFavoriteDetails({
                where: {
                    entity: entityType,
                    organizationId,
                    tenantId
                }
            })
                .then(({ items: details }) => {
                if (!details || !Array.isArray(details)) {
                    return [];
                }
                return details
                    .map((item) => {
                    if (!item) {
                        return null;
                    }
                    const rawTitle = item.name ||
                        item.title ||
                        item
                            .profile_link ||
                        'Untitled';
                    const title = this._truncateTitle(rawTitle);
                    return {
                        id: `favorite-${entityType}-${item.id}`,
                        title,
                        icon: this._getFavoriteIcon(entityType),
                        link: this._getFavoriteLink(entityType, item.id),
                        data: {
                            translationKey: title
                        }
                    };
                })
                    .filter(Boolean);
            })
                .catch((error) => {
                console.error(`Error loading favorites for ${entityType}:`, error);
                return [];
            });
            favoritePromises.push(promise);
        }
        const allFavoriteItems = await Promise.all(favoritePromises);
        return allFavoriteItems.flat();
    }
    _truncateTitle(title, maxLength = 24) {
        if (!title)
            return '';
        return title.length > maxLength ? `${title.slice(0, maxLength - 3)}...` : title;
    }
    _getFavoriteIcon(entityType) {
        return ENTITY_ICONS[entityType] || 'far fa-star';
    }
    _getFavoriteLink(entityType, entityId) {
        const linkFn = ENTITY_LINKS[entityType];
        return linkFn ? linkFn(entityId) : '/';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteStoreService, deps: [{ token: i1.FavoriteService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteStoreService, providedIn: 'root' }); }
};
FavoriteStoreService = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [FavoriteService, Store])
], FavoriteStoreService);
export { FavoriteStoreService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.FavoriteService }, { type: i2.Store }] });
//# sourceMappingURL=favorite-store.service.js.map