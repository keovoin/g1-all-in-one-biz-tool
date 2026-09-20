import { ICandidate, ID, IRelationalCandidate } from '@gauzy/contracts';
export declare class CandidateFeatureDTO implements IRelationalCandidate {
    readonly candidateId: ID;
    readonly candidate: ICandidate;
}
