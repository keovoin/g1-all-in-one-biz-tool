import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { TaskView } from '../view.entity';
import { ITaskViewUpdateInput } from '@gauzy/contracts';
declare const UpdateViewDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO> & Partial<TaskView>>;
export declare class UpdateViewDTO extends UpdateViewDTO_base implements ITaskViewUpdateInput {
}
export {};
