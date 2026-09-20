import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IPipelineStage } from './pipeline-stage.model';
import { IOrganizationContact } from './organization-contact.model';
interface IDealBase extends IBasePerTenantAndOrganizationEntityModel {
    title: string;
    probability: number;
    stage: IPipelineStage;
    stageId: ID;
    client?: IOrganizationContact;
    clientId?: ID;
}
export interface IDeal extends IDealBase {
}
export interface IDealCreateInput extends IDealBase {
}
export type IDealFindInput = Partial<IDealBase>;
export {};
