"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyCloudUserMigrateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const operators_1 = require("rxjs/operators");
const gauzy_cloud_service_1 = require("../../gauzy-cloud.service");
const gauzy_cloud_user_migrate_command_1 = require("./../gauzy-cloud-user.migrate.command");
let GauzyCloudUserMigrateHandler = class GauzyCloudUserMigrateHandler {
    constructor(gauzyCloudService) {
        this.gauzyCloudService = gauzyCloudService;
    }
    async execute(command) {
        const { input } = command;
        return this.gauzyCloudService.migrateUser(input).pipe((0, operators_1.switchMap)((response) => {
            if (response && response.data) {
                const { data } = response;
                const { password } = input;
                return this.gauzyCloudService.extractToken({
                    email: data.email,
                    password
                });
            }
        }), (0, operators_1.catchError)((error) => {
            console.log('Bad Promise:', error);
            throw new common_1.BadRequestException(error);
        }));
    }
};
exports.GauzyCloudUserMigrateHandler = GauzyCloudUserMigrateHandler;
exports.GauzyCloudUserMigrateHandler = GauzyCloudUserMigrateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(gauzy_cloud_user_migrate_command_1.GauzyCloudUserMigrateCommand),
    tslib_1.__metadata("design:paramtypes", [gauzy_cloud_service_1.GauzyCloudService])
], GauzyCloudUserMigrateHandler);
//# sourceMappingURL=gauzy-cloud-user.migrate.handler.js.map