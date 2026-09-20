import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { combineLatest, switchMap, take, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RequestMethodEnum } from '@gauzy/contracts';
import { Store } from '../services/store';
import * as i0 from "@angular/core";
import * as i1 from "../services/store";
let TenantInterceptor = class TenantInterceptor {
    constructor(store) {
        this.store = store;
    }
    /**
     * Intercept HTTP requests and modify them based on user and organization information.
     * @param request - The HttpRequest instance.
     * @param next - The HttpHandler instance.
     * @returns An Observable of HttpEvent<any>.
     */
    intercept(request, next) {
        const storeOrganization$ = this.store.selectedOrganization$;
        const storeUser$ = this.store.user$;
        /** */
        return combineLatest([storeUser$, storeOrganization$])
            .pipe(
        // Take only the first emission to avoid multiple subscriptions
        take(1), tap(([user, organization]) => {
            if (!!user) {
                // Bind tenantId for DELETE http method
                const tenantId = user.tenantId;
                // Clone the request to modify it
                request = request.clone({
                    ...(request.method === RequestMethodEnum.DELETE
                        ? {
                            setParams: {
                                tenantId,
                                ...(organization ? { organizationId: organization.id } : {})
                            }
                        }
                        : {}),
                    setHeaders: {
                        'Tenant-Id': `${tenantId}`,
                        ...(organization ? { 'Organization-Id': `${organization.id}` } : {})
                    }
                });
            }
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this))
            .pipe(
        // Switch back to the original observable chain to perform the subscription
        switchMap(() => next.handle(request)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantInterceptor, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantInterceptor }); }
};
TenantInterceptor = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [Store])
], TenantInterceptor);
export { TenantInterceptor };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Store }] });
//# sourceMappingURL=tenant.interceptor.js.map