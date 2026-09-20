import { IOrganizationProjectStoreState } from '@gauzy/contracts';
import { Query, Store as AkitaStore } from '@datorama/akita';
import * as i0 from "@angular/core";
export declare class OrganizationProjectAkitaStore extends AkitaStore<IOrganizationProjectStoreState> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationProjectAkitaStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationProjectAkitaStore>;
}
export declare class OrganizationProjectAkitaQuery extends Query<IOrganizationProjectStoreState> {
    constructor(store: OrganizationProjectAkitaStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationProjectAkitaQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationProjectAkitaQuery>;
}
/**
 * Service used to update organization project
 */
export declare class OrganizationProjectStore {
    protected organizationProjectAkitaStore: OrganizationProjectAkitaStore;
    protected organizationProjectAkitaQuery: OrganizationProjectAkitaQuery;
    constructor(organizationProjectAkitaStore: OrganizationProjectAkitaStore, organizationProjectAkitaQuery: OrganizationProjectAkitaQuery);
    organizationProjectAction$: import("rxjs").Observable<{
        project: import("@gauzy/contracts").IOrganizationProject;
        action: import("@gauzy/contracts").CrudActionEnum;
    }>;
    set organizationProjectAction({ project, action }: IOrganizationProjectStoreState);
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationProjectStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationProjectStore>;
}
