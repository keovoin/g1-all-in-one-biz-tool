import { ICandidateUpdateInput } from '@gauzy/contracts';
import { UpdateProfileDTO } from './../../employee/dto';
import { Candidate } from '../candidate.entity';
declare const UpdateCandidateDTO_base: import("@nestjs/common").Type<UpdateProfileDTO & Pick<Candidate, "appliedDate" | "hiredDate" | "candidateLevel" | "cvUrl">>;
export declare class UpdateCandidateDTO extends UpdateCandidateDTO_base implements ICandidateUpdateInput {
}
export {};
