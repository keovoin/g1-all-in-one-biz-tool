import { ID, IEmployee, IEmployeeEntityInput } from '@gauzy/contracts';
export declare class EmployeeFeatureDTO implements IEmployeeEntityInput {
    readonly employee: IEmployee;
    readonly employeeId: ID;
}
