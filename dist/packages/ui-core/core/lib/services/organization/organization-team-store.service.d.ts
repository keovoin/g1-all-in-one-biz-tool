import { IOrganizationTeamStoreState } from '@gauzy/contracts';
import { Query, Store as AkitaStore } from '@datorama/akita';
import * as i0 from "@angular/core";
export declare class OrganizationTeamAkitaStore extends AkitaStore<IOrganizationTeamStoreState> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationTeamAkitaStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationTeamAkitaStore>;
}
export declare class OrganizationTeamAkitaQuery extends Query<IOrganizationTeamStoreState> {
    constructor(store: OrganizationTeamAkitaStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationTeamAkitaQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationTeamAkitaQuery>;
}
/**
 * Service used to update organization Team
 */
export declare class OrganizationTeamStore {
    protected organizationTeamAkitaStore: OrganizationTeamAkitaStore;
    protected OrganizationTeamAkitaQuery: OrganizationTeamAkitaQuery;
    constructor(organizationTeamAkitaStore: OrganizationTeamAkitaStore, OrganizationTeamAkitaQuery: OrganizationTeamAkitaQuery);
    organizationTeamAction$: import("rxjs").Observable<{
        team: import("@gauzy/contracts").IOrganizationTeam;
        action: import("@gauzy/contracts").CrudActionEnum;
    }>;
    set organizationTeamAction({ team, action }: IOrganizationTeamStoreState);
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationTeamStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationTeamStore>;
}
