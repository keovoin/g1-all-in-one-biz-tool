"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginTenantDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_plugin_tenant_dto_1 = require("./create-plugin-tenant.dto");
class UpdatePluginTenantDTO extends (0, swagger_1.PartialType)(create_plugin_tenant_dto_1.CreatePluginTenantDTO) {
}
exports.UpdatePluginTenantDTO = UpdatePluginTenantDTO;
//# sourceMappingURL=update-plugin-tenant.dto.js.map