import { CandidateStatusEnum } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "./../../core/dto";
import { CandidateFeatureDTO } from "./../../candidate/dto";
import { CandidateInterviewerFeatureDTO } from "./../../candidate-interviewers/dto";
import { CandidateInterviewFeatureDTO } from "./../../candidate-interview/dto";
declare const CreateCandidateFeedbackDTO_base: import("@nestjs/mapped-types").MappedType<TenantOrganizationBaseDTO & CandidateFeatureDTO & CandidateInterviewerFeatureDTO & CandidateInterviewFeatureDTO>;
/**
 * CREATE candidate feedback DTO request validation
 *
 */
export declare class CreateCandidateFeedbackDTO extends CreateCandidateFeedbackDTO_base {
    readonly description: string;
    readonly rating: number;
    readonly status: CandidateStatusEnum;
}
export {};
