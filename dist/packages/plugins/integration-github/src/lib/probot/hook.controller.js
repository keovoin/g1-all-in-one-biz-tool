"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getControllerClass = getControllerClass;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const probot_discovery_1 = require("./probot.discovery");
/**
 * Factory function to create a NestJS controller class for handling webhook hooks.
 * @param path The path at which the controller should listen for webhook requests.
 */
function getControllerClass({ path }) {
    let HookController = class HookController {
        constructor(probotDiscovery) {
            this.probotDiscovery = probotDiscovery;
        }
        /**
         * Endpoint for receiving webhook requests.
         *
         * Unauthenticated by design — GitHub has no bearer token to present — so authenticity comes
         * entirely from the `x-hub-signature-256` HMAC that {@link ProbotDiscovery.receiveHook}
         * verifies. Its `ForbiddenException` is deliberately NOT caught: a receiver that answers 2xx
         * to a forged or unverifiable delivery is indistinguishable from one that works, and GitHub's
         * Recent Deliveries view is where an operator finds out the secret is wrong.
         *
         * @param req The Express request object.
         */
        async hooks(req) {
            // Forward the request to ProbotDiscovery for verification and processing.
            await this.probotDiscovery.receiveHook(req);
            return { received: true };
        }
    };
    tslib_1.__decorate([
        (0, common_1.Post)([path]),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        tslib_1.__param(0, (0, common_1.Req)()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], HookController.prototype, "hooks", null);
    HookController = tslib_1.__decorate([
        (0, common_2.Public)(),
        (0, swagger_1.ApiExcludeController)(),
        (0, common_1.Controller)(),
        tslib_1.__metadata("design:paramtypes", [probot_discovery_1.ProbotDiscovery])
    ], HookController);
    return HookController;
}
//# sourceMappingURL=hook.controller.js.map