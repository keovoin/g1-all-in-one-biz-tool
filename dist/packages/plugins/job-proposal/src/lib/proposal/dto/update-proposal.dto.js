"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProposalDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const core_1 = require("@gauzy/core");
const proposal_dto_1 = require("./proposal.dto");
/**
 * Update proposal request DTO validation
 */
class UpdateProposalDTO extends (0, mapped_types_1.IntersectionType)((0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(proposal_dto_1.ProposalDTO, ['valueDate'])), core_1.RelationalTagDTO) {
}
exports.UpdateProposalDTO = UpdateProposalDTO;
//# sourceMappingURL=update-proposal.dto.js.map