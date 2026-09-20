"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateEmailController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const common_2 = require("@gauzy/common");
const pipes_1 = require("../shared/pipes");
const estimate_email_service_1 = require("./estimate-email.service");
const dto_1 = require("./dto");
let EstimateEmailController = class EstimateEmailController {
    constructor(estimateEmailService) {
        this.estimateEmailService = estimateEmailService;
    }
    /**
     * Validate estimate email request
     *
     * @param params
     * @returns
     */
    async validateEstimateEmail(params) {
        return await this.estimateEmailService.validate(params, params.relations);
    }
};
exports.EstimateEmailController = EstimateEmailController;
tslib_1.__decorate([
    (0, common_1.Get)('/validate'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.FindEstimateEmailQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EstimateEmailController.prototype, "validateEstimateEmail", null);
exports.EstimateEmailController = EstimateEmailController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EstimateEmail'),
    (0, common_2.Public)(),
    (0, common_1.Controller)('/estimate-email'),
    tslib_1.__metadata("design:paramtypes", [estimate_email_service_1.EstimateEmailService])
], EstimateEmailController);
//# sourceMappingURL=estimate-email.controller.js.map