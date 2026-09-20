import { DataSource } from 'typeorm';
import { ICandidate, IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
import { CandidateInterviewers } from './../core/entities/internal';
export declare const createDefaultCandidateInterviewers: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, defaultEmployees: any, defaultCandidates: any) => Promise<CandidateInterviewers[]>;
export declare const createRandomCandidateInterviewers: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>, tenantCandidatesMap: Map<ITenant, ICandidate[]> | void) => Promise<CandidateInterviewers[]>;
