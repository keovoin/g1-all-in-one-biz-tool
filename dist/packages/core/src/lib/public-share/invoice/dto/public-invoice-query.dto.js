"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicInvoiceQueryDTO = exports.PublicInvoiceRelationEnum = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../../shared/dto");
/**
 * Allowed relations for the public invoice endpoint.
 *
 * Only relations whose columns are explicitly constrained by the service's
 * `select` clause are permitted.  Any relation not in this enum will be
 * rejected by class-validator.
 */
var PublicInvoiceRelationEnum;
(function (PublicInvoiceRelationEnum) {
    PublicInvoiceRelationEnum["tenant"] = "tenant";
    PublicInvoiceRelationEnum["organization"] = "organization";
    PublicInvoiceRelationEnum["fromOrganization"] = "fromOrganization";
    PublicInvoiceRelationEnum["toContact"] = "toContact";
    PublicInvoiceRelationEnum["invoiceItems"] = "invoiceItems";
    PublicInvoiceRelationEnum["invoiceItems.employee"] = "invoiceItems.employee";
    PublicInvoiceRelationEnum["invoiceItems.employee.user"] = "invoiceItems.employee.user";
    PublicInvoiceRelationEnum["invoiceItems.project"] = "invoiceItems.project";
    PublicInvoiceRelationEnum["invoiceItems.product"] = "invoiceItems.product";
    PublicInvoiceRelationEnum["invoiceItems.expense"] = "invoiceItems.expense";
    PublicInvoiceRelationEnum["invoiceItems.task"] = "invoiceItems.task";
})(PublicInvoiceRelationEnum || (exports.PublicInvoiceRelationEnum = PublicInvoiceRelationEnum = {}));
/**
 * Get public invoice request DTO validation
 */
class PublicInvoiceQueryDTO {
    constructor() {
        this.relations = [];
    }
}
exports.PublicInvoiceQueryDTO = PublicInvoiceQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: PublicInvoiceRelationEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(dto_1.parseRelationsString),
    (0, class_validator_1.IsEnum)(PublicInvoiceRelationEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], PublicInvoiceQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=public-invoice-query.dto.js.map