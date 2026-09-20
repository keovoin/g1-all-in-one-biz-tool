import { OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import { IEmployee, ITimeOffPolicy, ITimeOff, IOrganization, IImageAsset as IDocumentAsset } from '@gauzy/contracts';
import { OrganizationDocumentsService, Store } from '@gauzy/ui-core/core';
import { EmployeeSelectorComponent } from '../../selectors/employee/employee.component';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
export declare class TimeOffRequestMutationComponent implements OnInit {
    protected readonly dialogRef: NbDialogRef<TimeOffRequestMutationComponent>;
    private readonly fb;
    private readonly documentsService;
    private readonly store;
    private readonly dateService;
    FormHelpers: typeof FormHelpers;
    /**
     * Employee Selector
     */
    employeeSelector: EmployeeSelectorComponent;
    set content(component: EmployeeSelectorComponent);
    type: string;
    _timeOff: ITimeOff;
    get timeOff(): ITimeOff;
    set timeOff(value: ITimeOff);
    employeesArr: IEmployee[];
    selectedEmployee: any;
    isEditMode: boolean;
    minDate: Date;
    organization: IOrganization;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<TimeOffRequestMutationComponent>, fb: UntypedFormBuilder, documentsService: OrganizationDocumentsService, store: Store, dateService: NbDateService<Date>);
    ngOnInit(): void;
    /**
     * Upload document asset
     *
     * @param image
     */
    uploadDocumentAsset(document: IDocumentAsset): void;
    /**
     * Upload document asset URL
     *
     * @param image
     */
    uploadDocumentAssetUrl(documentUrl: IDocumentAsset['fullUrl']): void;
    /**
     * Patch form value on edit section
     */
    patchFormValue(): void;
    saveRequest(): void;
    getRequestForm(reqType: string): void;
    private _createNewRecord;
    /**
     * On Policy Selection
     *
     * @param policy
     */
    onPolicySelected(policy: ITimeOffPolicy): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeOffRequestMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeOffRequestMutationComponent, "ngx-time-off-request-mutation", never, { "type": { "alias": "type"; "required": false; }; "timeOff": { "alias": "timeOff"; "required": false; }; }, {}, never, never, false, never>;
}
