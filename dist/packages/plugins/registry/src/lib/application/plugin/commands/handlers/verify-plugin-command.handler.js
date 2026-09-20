"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const verify_plugin_command_1 = require("../../commands/verify-plugin.command");
/**
 * Command handler responsible for verifying plugin signatures.
 *
 * This handler processes VerifyPluginCommand requests and delegates to the
 * PluginSecurityService to authenticate plugin signatures against their version IDs.
 *
 * @implements {ICommandHandler<VerifyPluginCommand>}
 */
let VerifyPluginCommandHandler = class VerifyPluginCommandHandler {
    /**
     * Creates an instance of VerifyPluginCommandHandler.
     *
     * @param {PluginSecurityService} securityService - Service responsible for plugin security operations
     * @param {PluginService} pluginService - Service responsible for plugin operations
     */
    constructor(securityService, pluginService) {
        this.securityService = securityService;
        this.pluginService = pluginService;
    }
    /**
     * Executes the verify plugin command.
     *
     * Extracts the version ID and signature from the command input and
     * forwards them to the security service for verification.
     *
     * @param {VerifyPluginCommand} command - The command containing plugin verification data
     * @returns {Promise<boolean>} True if the signature is valid, false otherwise
     * @throws {NotFoundException} When the plugin with the specified ID is not found
     */
    async execute(command) {
        const { input, pluginId } = command;
        // Verify plugin ID
        const plugin = await this.pluginService.findOneOrFailByIdString(pluginId);
        if (!plugin.success) {
            throw new common_1.NotFoundException(`Plugin with ID ${pluginId} not found`);
        }
        // Verify the plugin version ID and signature
        return this.securityService.verifySignature(input.versionId, input.signature);
    }
};
exports.VerifyPluginCommandHandler = VerifyPluginCommandHandler;
exports.VerifyPluginCommandHandler = VerifyPluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(verify_plugin_command_1.VerifyPluginCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSecurityService,
        domain_1.PluginService])
], VerifyPluginCommandHandler);
//# sourceMappingURL=verify-plugin-command.handler.js.map