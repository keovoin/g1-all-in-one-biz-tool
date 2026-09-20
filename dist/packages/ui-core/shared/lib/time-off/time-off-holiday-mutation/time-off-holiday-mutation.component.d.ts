import { OnInit } from '@angular/core';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import { IEmployee, ITimeOffPolicy, IOrganization } from '@gauzy/contracts';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { EmployeesService, Store, ToastrService } from '@gauzy/ui-core/core';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
export declare class TimeOffHolidayMutationComponent implements OnInit {
    protected readonly dialogRef: NbDialogRef<TimeOffHolidayMutationComponent>;
    private readonly fb;
    private readonly toastrService;
    private readonly employeesService;
    private readonly store;
    private readonly dateService;
    FormHelpers: typeof FormHelpers;
    constructor(dialogRef: NbDialogRef<TimeOffHolidayMutationComponent>, fb: UntypedFormBuilder, toastrService: ToastrService, employeesService: EmployeesService, store: Store, dateService: NbDateService<Date>);
    orgEmployees: IEmployee[];
    employeesArr: IEmployee[];
    holidays: any[];
    minDate: Date;
    organization: IOrganization;
    countryCode: string;
    employeeIds: string[];
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    ngOnInit(): void;
    private _getAllHolidays;
    saveHoliday(): void;
    private _createNewRecord;
    private _getFormData;
    private _getOrganizationEmployees;
    onPolicySelected(policy: ITimeOffPolicy): void;
    onEmployeesSelected(employees: string[]): void;
    /**
     * Patch value on holiday selected
     *
     * @param holiday
     */
    onHolidaySelected(holiday: any): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeOffHolidayMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeOffHolidayMutationComponent, "ngx-time-off-holiday-mutation", never, {}, {}, never, never, false, never>;
}
