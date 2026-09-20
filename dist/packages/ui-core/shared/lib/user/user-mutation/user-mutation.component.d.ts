import { OnInit } from '@angular/core';
import { IUser, IOrganization } from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { BasicInfoFormComponent } from '../forms/basic-info/basic-info-form.component';
import * as i0 from "@angular/core";
export declare class UserMutationComponent implements OnInit {
    private readonly _dialogRef;
    private readonly _store;
    private readonly _toastrService;
    userBasicInfo: BasicInfoFormComponent;
    organization: IOrganization;
    constructor(_dialogRef: NbDialogRef<UserMutationComponent>, _store: Store, _toastrService: ToastrService);
    ngOnInit(): void;
    /**
     * Closes the dialog and passes the user data if provided.
     *
     * @param user - The user object to pass when closing the dialog. Defaults to null.
     */
    closeDialog(user?: IUser): void;
    /**
     * Registers a user with the default role of VIEWER and associates them with the current organization.
     * Closes the dialog with the newly registered user or shows an error if the registration fails.
     */
    add(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserMutationComponent, "ga-user-mutation", never, {}, {}, never, never, false, never>;
}
