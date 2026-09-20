"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyCloudOrganizationMigrateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const gauzy_cloud_service_1 = require("../../gauzy-cloud.service");
const gauzy_cloud_organization_migrate_command_1 = require("./../gauzy-cloud-organization.migrate.command");
let GauzyCloudOrganizationMigrateHandler = class GauzyCloudOrganizationMigrateHandler {
    constructor(gauzyCloudService) {
        this.gauzyCloudService = gauzyCloudService;
    }
    async execute(command) {
        const { input, token } = command;
        return this.gauzyCloudService.migrateOrganization(input, token);
    }
};
exports.GauzyCloudOrganizationMigrateHandler = GauzyCloudOrganizationMigrateHandler;
exports.GauzyCloudOrganizationMigrateHandler = GauzyCloudOrganizationMigrateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(gauzy_cloud_organization_migrate_command_1.GauzyCloudOrganizationMigrateCommand),
    tslib_1.__metadata("design:paramtypes", [gauzy_cloud_service_1.GauzyCloudService])
], GauzyCloudOrganizationMigrateHandler);
//# sourceMappingURL=gauzy-cloud-organization.migrate.handler.js.map