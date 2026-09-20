import { ITaskVersionCreateInput } from '@gauzy/contracts';
import { TaskVersion } from '../version.entity';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
declare const CreateVersionDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO> & TaskVersion>;
export declare class CreateVersionDTO extends CreateVersionDTO_base implements ITaskVersionCreateInput {
}
export {};
