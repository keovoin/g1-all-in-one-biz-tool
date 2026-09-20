import { CreateCandidateFeedbackDTO } from "./create-candidate-feedback.dto";
declare const UpdateCandidateFeedbackDTO_base: import("@nestjs/mapped-types").MappedType<Omit<CreateCandidateFeedbackDTO, "candidate" | "candidateId">>;
/**
 * UPDATE candidate feedback DTO request validation
 *
 */
export declare class UpdateCandidateFeedbackDTO extends UpdateCandidateFeedbackDTO_base {
}
export {};
