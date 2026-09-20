"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProposalDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const core_1 = require("@gauzy/core");
const proposal_dto_1 = require("./proposal.dto");
/**
 * Create proposal request DTO validation
 */
class CreateProposalDTO extends (0, mapped_types_1.IntersectionType)(proposal_dto_1.ProposalDTO, (0, mapped_types_1.PartialType)(core_1.EmployeeFeatureDTO), core_1.RelationalTagDTO) {
}
exports.CreateProposalDTO = CreateProposalDTO;
//# sourceMappingURL=create-proposal.dto.js.map