"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkAuthorizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
let UpworkAuthorizationController = class UpworkAuthorizationController {
    constructor(_config) {
        this._config = _config;
    }
    /**
     * Handle the callback from the Upwork integration.
     *
     * @param {any} query - The query parameters from the callback.
     * @param {Response} response - Express Response object.
     */
    async upworkIntegrationCallback(query, response) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!query || !query.oauth_token || !query.oauth_verifier) {
                throw new common_1.HttpException('Invalid query parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            /** Upwork Config Options */
            const upwork = this._config.get('upwork');
            // Convert query params object to string
            const queryParamsString = (0, utils_1.buildQueryString)({
                oauth_token: query.oauth_token,
                oauth_verifier: query.oauth_verifier
            });
            // Combine upwork post install URL with query params
            const url = [upwork.postInstallUrl, queryParamsString].filter(Boolean).join('?');
            /** Redirect to the URL */
            return response.redirect(url);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to add ${contracts_1.IntegrationEnum.UPWORK} integration: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UpworkAuthorizationController = UpworkAuthorizationController;
tslib_1.__decorate([
    (0, common_1.Get)('callback'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UpworkAuthorizationController.prototype, "upworkIntegrationCallback", null);
exports.UpworkAuthorizationController = UpworkAuthorizationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Upwork Integrations'),
    (0, common_2.Public)(),
    (0, common_1.Controller)('/integrations/upwork'),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], UpworkAuthorizationController);
//# sourceMappingURL=upwork-authorization.controller.js.map