"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginInstallationService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const mikro_orm_plugin_installation_repository_1 = require("../repositories/mikro-orm-plugin-installation.repository");
const type_orm_plugin_installation_repository_1 = require("../repositories/type-orm-plugin-installation.repository");
let PluginInstallationService = class PluginInstallationService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginInstallationRepository, mikroOrmPluginInstallationRepository) {
        super(typeOrmPluginInstallationRepository, mikroOrmPluginInstallationRepository);
        this.typeOrmPluginInstallationRepository = typeOrmPluginInstallationRepository;
        this.mikroOrmPluginInstallationRepository = mikroOrmPluginInstallationRepository;
    }
};
exports.PluginInstallationService = PluginInstallationService;
exports.PluginInstallationService = PluginInstallationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_plugin_installation_repository_1.TypeOrmPluginInstallationRepository,
        mikro_orm_plugin_installation_repository_1.MikroOrmPluginInstallationRepository])
], PluginInstallationService);
//# sourceMappingURL=plugin-installation.service.js.map