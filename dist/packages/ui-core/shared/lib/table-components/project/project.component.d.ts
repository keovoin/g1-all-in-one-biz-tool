import { OnInit } from '@angular/core';
import { IOrganization, IProject } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProjectComponent implements OnInit {
    value: any;
    rowData: any;
    organization: Promise<IOrganization> | null;
    count: number;
    project: IProject;
    projects: IProject[];
    constructor();
    ngOnInit(): void;
    init(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectComponent, "ngx-project", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
