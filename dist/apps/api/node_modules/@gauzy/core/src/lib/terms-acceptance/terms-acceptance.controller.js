"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAcceptanceController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const terms_acceptance_service_1 = require("./terms-acceptance.service");
let TermsAcceptanceController = class TermsAcceptanceController {
    constructor(termsAcceptanceService) {
        this.termsAcceptanceService = termsAcceptanceService;
    }
    /**
     * The documents a new account must accept, as currently published.
     *
     * Public and unauthenticated by necessity — it is read by the signup and
     * invite-acceptance forms, before any account exists.
     *
     * The point of serving this rather than hard-coding versions in the client is
     * that the value which gates the submit button and the value which is posted
     * back on submit are then the same object. Dropping it becomes a visible act
     * rather than an omission, which is exactly how the checkbox came to be
     * decorative in the first place.
     */
    async getRequiredDocuments(locale) {
        return this.termsAcceptanceService.getRequiredDocuments(locale);
    }
};
exports.TermsAcceptanceController = TermsAcceptanceController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List the legal documents a new account must accept' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Document id, version, sha256 and locale for each required document.'
    }),
    (0, common_1.Get)('/required'),
    (0, common_2.Public)(),
    tslib_1.__param(0, (0, common_1.Query)('locale')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TermsAcceptanceController.prototype, "getRequiredDocuments", null);
exports.TermsAcceptanceController = TermsAcceptanceController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Terms'),
    (0, common_1.Controller)('/terms'),
    tslib_1.__metadata("design:paramtypes", [terms_acceptance_service_1.TermsAcceptanceService])
], TermsAcceptanceController);
//# sourceMappingURL=terms-acceptance.controller.js.map