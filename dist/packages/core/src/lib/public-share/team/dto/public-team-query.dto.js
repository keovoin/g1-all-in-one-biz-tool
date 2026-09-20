"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicTeamQueryDTO = exports.PublicTeamRelationEnum = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("./../../../shared/dto");
const dto_2 = require("./../../../organization-team/dto");
const dto_3 = require("./../../../time-tracking/timer/dto");
/**
 * Get public employee request DTO validation
 */
var PublicTeamRelationEnum;
(function (PublicTeamRelationEnum) {
    PublicTeamRelationEnum["organization"] = "organization";
    PublicTeamRelationEnum["members"] = "members";
    PublicTeamRelationEnum["members.employee"] = "members.employee";
    PublicTeamRelationEnum["members.employee.user"] = "members.employee.user";
    PublicTeamRelationEnum["tasks"] = "tasks";
    PublicTeamRelationEnum["tasks.members"] = "tasks.members";
    PublicTeamRelationEnum["tasks.teams"] = "tasks.teams";
    PublicTeamRelationEnum["tasks.tags"] = "tasks.tags";
    PublicTeamRelationEnum["statuses"] = "statuses";
    PublicTeamRelationEnum["priorities"] = "priorities";
    PublicTeamRelationEnum["sizes"] = "sizes";
    PublicTeamRelationEnum["labels"] = "labels";
    PublicTeamRelationEnum["issueTypes"] = "issueTypes";
})(PublicTeamRelationEnum || (exports.PublicTeamRelationEnum = PublicTeamRelationEnum = {}));
class PublicTeamQueryDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PickType)(dto_2.OrganizationTeamStatisticDTO, ['withLastWorkedTask']), (0, swagger_1.PickType)(dto_1.DateRangeQueryDTO, ['startDate', 'endDate']), (0, swagger_1.PickType)((0, swagger_1.PartialType)(dto_3.TimerStatusQueryDTO), ['source'])) {
}
exports.PublicTeamQueryDTO = PublicTeamQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: PublicTeamRelationEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PublicTeamRelationEnum, { each: true }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? value.map((element) => element.trim()) : {})),
    tslib_1.__metadata("design:type", Array)
], PublicTeamQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=public-team-query.dto.js.map