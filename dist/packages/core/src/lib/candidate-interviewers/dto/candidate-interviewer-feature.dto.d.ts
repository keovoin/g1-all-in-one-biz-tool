import { ICandidateInterviewers, IRelationalCandidateInterviewer } from "@gauzy/contracts";
export declare class CandidateInterviewerFeatureDTO implements IRelationalCandidateInterviewer {
    readonly interviewer: ICandidateInterviewers;
    readonly interviewerId: ICandidateInterviewers['id'];
}
