import { ICandidate, ICandidateEducation, ITenant } from '@gauzy/contracts';
import { DataSource } from 'typeorm';
import { CandidateEducation } from './../core/entities/internal';
export declare const createCandidateEducations: (dataSource: DataSource, tenant: ITenant, candidates: ICandidate[] | void) => Promise<CandidateEducation[]>;
export declare const createRandomCandidateEducations: (dataSource: DataSource, tenants: ITenant[], tenantCandidatesMap: Map<ITenant, ICandidate[]> | void) => Promise<Map<ICandidate, ICandidateEducation[]>>;
