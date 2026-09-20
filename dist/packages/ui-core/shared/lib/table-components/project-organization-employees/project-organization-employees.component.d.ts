import { Router } from '@angular/router';
import { IPersonListItem } from '../people-list/people-list.component';
import * as i0 from "@angular/core";
/**
 * The members block of a project card (Organization → Projects, cards layout).
 *
 * Uses the same `ngx-people-list` treatment as the grid columns so the two
 * layouts of the same page render people identically; the card only lets the
 * group wrap and name more people, because it has the room.
 */
export declare class ProjectOrganizationEmployeesComponent {
    readonly router: Router;
    value: string | number;
    rowData: any;
    constructor(router: Router);
    /**
     * Navigates to the employee edit page of the clicked person.
     *
     * @param person - The person that was clicked in the list.
     */
    edit(person: IPersonListItem): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectOrganizationEmployeesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectOrganizationEmployeesComponent, "gauzy-project-organization-employees", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
