import { ICandidateInterview, IRelationalCandidateInterview } from "@gauzy/contracts";
export declare class CandidateInterviewFeatureDTO implements IRelationalCandidateInterview {
    readonly interview: ICandidateInterview;
    readonly interviewId: ICandidateInterview['id'];
}
