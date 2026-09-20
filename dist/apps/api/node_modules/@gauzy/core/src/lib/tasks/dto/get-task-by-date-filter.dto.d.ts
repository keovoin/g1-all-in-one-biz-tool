import { ITaskDateFilterInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
export declare class TaskDateFilterInputDTO extends TenantOrganizationBaseDTO implements ITaskDateFilterInput {
    startDateFrom?: Date;
    startDateTo?: Date;
    dueDateFrom?: Date;
    dueDateTo?: Date;
}
