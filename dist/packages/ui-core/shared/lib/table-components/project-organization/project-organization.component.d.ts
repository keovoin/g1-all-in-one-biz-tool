import { OnInit } from '@angular/core';
import { IOrganization, IProject } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProjectOrganizationComponent implements OnInit {
    value: any;
    rowData: any;
    organization: Promise<IOrganization> | null;
    count: number;
    project: IProject;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectOrganizationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectOrganizationComponent, "gauzy-project-organization", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
