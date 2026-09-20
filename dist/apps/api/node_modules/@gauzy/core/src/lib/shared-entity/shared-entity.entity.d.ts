import { EntityRepositoryType } from "@mikro-orm/core";
import { ISharedEntity, IShareRule, JsonData } from "@gauzy/contracts";
import { BasePerEntityType } from "../core/entities/internal";
import { MikroOrmSharedEntityRepository } from "./repository/mikro-orm-shared-entity.repository";
export declare class SharedEntity extends BasePerEntityType implements ISharedEntity {
    [EntityRepositoryType]?: MikroOrmSharedEntityRepository;
    /**
     * The token that is used to identify and access the shared entity.
     */
    token: string;
    /**
     * The rules that define how the shared entity is shared — Essentially stores entity fields and relations that are shared.
     */
    shareRules: IShareRule | string;
    /**
     * The additional options for the shared entity.
     */
    sharedOptions?: JsonData;
}
