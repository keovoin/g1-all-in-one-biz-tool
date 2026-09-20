import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { Subject } from 'rxjs';
import { IOrganization, IOrganizationTeam, ISelectedEmployee } from '@gauzy/contracts';
import { OrganizationTeamsService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class OrganizationTeamFilterComponent extends DefaultFilter implements OnInit, OnChanges {
    private readonly store;
    private readonly organizationTeamsService;
    teams: IOrganizationTeam[];
    organization: IOrganization;
    selectedEmployeeId: ISelectedEmployee['id'];
    subject$: Subject<any>;
    constructor(store: Store, organizationTeamsService: OrganizationTeamsService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     *
     * @param value
     */
    onChange(value: IOrganizationTeam): void;
    /**
     *
     * @returns
     */
    getTeams(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationTeamFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OrganizationTeamFilterComponent, "ga-organization-team-select-filter", never, {}, {}, never, never, false, never>;
}
