import * as i0 from "@angular/core";
export declare class AssignedToComponent {
    rowData: any;
    value: any;
    view: 'members' | 'teams';
    ngOnInit(): void;
    /**
     * Extracts an array of team names from the given task.
     * @param task The task object.
     * @returns An array of team names.
     */
    private _getTeamNames;
    static ɵfac: i0.ɵɵFactoryDeclaration<AssignedToComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AssignedToComponent, "ngx-assigned-to", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
