import { IPipelineCreateInput } from '@gauzy/contracts';
import { Pipeline } from '../../core/entities/internal';
import { TenantOrganizationBaseDTO } from '../../core/dto';
declare const PipelineDTO_base: import("@nestjs/mapped-types").MappedType<TenantOrganizationBaseDTO & Pick<Pipeline, "name" | "description" | "isActive" | "isArchived" | "stages">>;
/**
 * Pipeline DTO
 */
export declare class PipelineDTO extends PipelineDTO_base {
}
/**
 * Create pipeline DTO
 */
export declare class CreatePipelineDTO extends PipelineDTO implements IPipelineCreateInput {
}
export {};
