import { IOrganization, IOrganizationFindInput, IOrganizationStoreState, IOrganizationUpdateInput } from '@gauzy/contracts';
import { BehaviorSubject } from 'rxjs';
import { Query, Store as AkitaStore } from '@datorama/akita';
import * as i0 from "@angular/core";
export declare class OrganizationStore extends AkitaStore<IOrganizationStoreState> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationStore>;
}
export declare class OrganizationQuery extends Query<IOrganizationStoreState> {
    constructor(store: OrganizationStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationQuery>;
}
/**
 * Service used to update organization
 */
export declare class OrganizationEditStore {
    protected organizationStore: OrganizationStore;
    protected organizationQuery: OrganizationQuery;
    private _selectedOrganization;
    private _organizationForm;
    constructor(organizationStore: OrganizationStore, organizationQuery: OrganizationQuery);
    selectedOrganization$: BehaviorSubject<IOrganization>;
    organizationForm$: BehaviorSubject<IOrganizationFindInput>;
    set selectedOrganization(organization: IOrganization);
    get selectedOrganization(): IOrganization;
    set organizationForm(organization: IOrganizationUpdateInput);
    get organizationForm(): Partial<IOrganizationUpdateInput>;
    organizationAction$: import("rxjs").Observable<{
        organization: IOrganization;
        action: import("@gauzy/contracts").CrudActionEnum;
    }>;
    set organizationAction({ organization, action }: IOrganizationStoreState);
    /**
     * Update the organization form with new data
     *
     * @param formData - The form data to update.
     */
    updateOrganizationForm(formData: Partial<IOrganizationUpdateInput>): Promise<void>;
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationEditStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationEditStore>;
}
