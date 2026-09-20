import { ITaskViewCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { TaskView } from '../view.entity';
declare const CreateViewDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO> & TaskView>;
export declare class CreateViewDTO extends CreateViewDTO_base implements ITaskViewCreateInput {
}
export {};
