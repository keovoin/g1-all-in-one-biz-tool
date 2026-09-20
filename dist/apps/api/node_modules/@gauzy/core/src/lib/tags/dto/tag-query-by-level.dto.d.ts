import { ITagFindInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { RelationsQueryDTO } from '../../shared/dto';
declare const TagQueryByLevelDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO> & RelationsQueryDTO>;
export declare class TagQueryByLevelDTO extends TagQueryByLevelDTO_base implements ITagFindInput {
}
export {};
