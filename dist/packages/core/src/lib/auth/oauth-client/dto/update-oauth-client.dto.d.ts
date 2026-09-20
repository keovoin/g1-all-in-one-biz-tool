import { IOAuthClientUpdateInput } from '@gauzy/contracts';
import { CreateOAuthClientDTO } from './create-oauth-client.dto';
declare const UpdateOAuthClientDTO_base: import("@nestjs/common").Type<Partial<Pick<CreateOAuthClientDTO, "name" | "description" | "redirectUris" | "allowedScopes" | "allowedGrantTypes" | "pkceRequired" | "accessTokenTtl" | "refreshTokenTtl">>>;
export declare class UpdateOAuthClientDTO extends UpdateOAuthClientDTO_base implements IOAuthClientUpdateInput {
    isActive?: boolean;
}
export {};
