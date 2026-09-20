"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProposalTemplateDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const core_1 = require("@gauzy/core");
const proposal_template_dto_1 = require("./proposal-template.dto");
/**
 * Create proposal template request DTO validation
 *
 */
class CreateProposalTemplateDTO extends (0, mapped_types_1.IntersectionType)(proposal_template_dto_1.ProposalTemplateDTO, core_1.EmployeeFeatureDTO) {
}
exports.CreateProposalTemplateDTO = CreateProposalTemplateDTO;
//# sourceMappingURL=create-proposal-template.dto.js.map