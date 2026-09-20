import { IPipeline, IPipelineStage } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class Pipeline extends TenantOrganizationBaseEntity implements IPipeline {
    description: string;
    name: string;
    stages: IPipelineStage[];
    /**
     * 	@BeforeInsert
     */
    __before_persist?(): void;
}
