import * as i0 from "@angular/core";
export declare class ProjectOrganizationGridComponent {
    value: string | number;
    private _rowData;
    private _visibility$;
    constructor();
    onVisibilityChange(state: boolean): void;
    get visibility(): boolean;
    set rowData(value: any);
    get rowData(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProjectOrganizationGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProjectOrganizationGridComponent, "gauzy-project-organization-grid", never, { "value": { "alias": "value"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, {}, never, never, false, never>;
}
