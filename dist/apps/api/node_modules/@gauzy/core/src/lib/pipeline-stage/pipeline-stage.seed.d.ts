import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
import { PipelineStage } from './pipeline-stage.entity';
export declare const createRandomPipelineStage: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<PipelineStage[]>;
