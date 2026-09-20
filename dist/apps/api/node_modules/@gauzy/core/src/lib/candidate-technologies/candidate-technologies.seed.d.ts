import { DataSource } from 'typeorm';
import { ICandidate, IOrganization, ITenant } from '@gauzy/contracts';
import { CandidateTechnologies } from './candidate-technologies.entity';
export declare const createDefaultCandidateTechnologies: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, defaultCandidates: any) => Promise<CandidateTechnologies[]>;
export declare const createRandomCandidateTechnologies: (dataSource: DataSource, tenants: ITenant[], tenantCandidatesMap: Map<ITenant, ICandidate[]> | void) => Promise<CandidateTechnologies[]>;
