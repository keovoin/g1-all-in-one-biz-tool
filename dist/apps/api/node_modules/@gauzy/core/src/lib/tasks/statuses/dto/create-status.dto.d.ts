import { ITaskStatusCreateInput } from '@gauzy/contracts';
import { TaskStatus } from '../status.entity';
import { TenantOrganizationBaseDTO } from './../../../core/dto';
declare const CreateStatusDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO> & TaskStatus>;
export declare class CreateStatusDTO extends CreateStatusDTO_base implements ITaskStatusCreateInput {
}
export {};
