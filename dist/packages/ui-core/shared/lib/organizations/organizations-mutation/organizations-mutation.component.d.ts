import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class OrganizationsMutationComponent implements OnInit {
    protected readonly dialogRef: NbDialogRef<OrganizationsMutationComponent>;
    constructor(dialogRef: NbDialogRef<OrganizationsMutationComponent>);
    ngOnInit(): void;
    addOrganization(consolidatedFormValues: any): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationsMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OrganizationsMutationComponent, "ga-organizations-mutation", never, {}, {}, never, never, false, never>;
}
