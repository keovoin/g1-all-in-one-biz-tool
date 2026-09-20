import { IFavoriteCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { Favorite } from '../favorite.entity';
declare const CreateFavoriteDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Favorite>;
export declare class CreateFavoriteDTO extends CreateFavoriteDTO_base implements IFavoriteCreateInput {
}
export {};
