"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubInstallationDeleteCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const octokit_service_1 = require("../../../probot/octokit.service");
const github_installation_delete_command_1 = require("../github-installation.delete.command");
let GithubInstallationDeleteCommandHandler = class GithubInstallationDeleteCommandHandler {
    constructor(_octokitService) {
        this._octokitService = _octokitService;
    }
    /**
     * Execute the GitHub installation deletion command.
     * @param command - The GithubInstallationDeleteCommand instance.
     */
    async execute(command) {
        const { integration } = command;
        // Convert array of settings to an object using 'arrayToObject' utility function
        const settings = (0, utils_1.arrayToObject)(integration.settings, 'settingsName', 'settingsValue');
        // Check if the required installation_id is present in settings
        if (!settings || !settings.installation_id) {
            throw new common_1.HttpException('Invalid request parameter: Missing or unauthorized integration', common_1.HttpStatus.UNAUTHORIZED);
        }
        // Retrieve installation_id from settings
        const installation_id = settings['installation_id'];
        // Call the OctokitService to delete the GitHub installation
        return await this._octokitService.deleteInstallation(installation_id);
    }
};
exports.GithubInstallationDeleteCommandHandler = GithubInstallationDeleteCommandHandler;
exports.GithubInstallationDeleteCommandHandler = GithubInstallationDeleteCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(github_installation_delete_command_1.GithubInstallationDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [octokit_service_1.OctokitService])
], GithubInstallationDeleteCommandHandler);
//# sourceMappingURL=github-installation.delete.handler.js.map