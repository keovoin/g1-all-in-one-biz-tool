import { ICandidateInterview, ICandidateInterviewCreateInput } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "./../../core/dto";
import { CandidateFeatureDTO } from "./../../candidate/dto";
declare const CreateCandidateInterviewDTO_base: import("@nestjs/mapped-types").MappedType<TenantOrganizationBaseDTO & CandidateFeatureDTO>;
/**
 * CREATE candidate interview DTO request validation
 *
 */
export declare class CreateCandidateInterviewDTO extends CreateCandidateInterviewDTO_base implements ICandidateInterviewCreateInput {
    readonly title: ICandidateInterview['title'];
    readonly startTime: ICandidateInterview['startTime'];
    readonly endTime: ICandidateInterview['endTime'];
    readonly location: ICandidateInterview['location'];
    readonly note: ICandidateInterview['note'];
    readonly rating: ICandidateInterview['rating'];
}
export {};
