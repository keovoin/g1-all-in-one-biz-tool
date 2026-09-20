import { ICandidateInterview } from "@gauzy/contracts";
import { CreateCandidateInterviewDTO } from "./create-candidate-interview.dto";
/**
 * UPDATE candidate interview DTO request validation
 *
 */
export declare class UpdateCandidateInterviewDTO extends CreateCandidateInterviewDTO {
    readonly isArchived: ICandidateInterview['isArchived'];
}
