"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCheckModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tenant_api_key_module_1 = require("../tenant-api-key/tenant-api-key.module");
const user_module_1 = require("../user/user.module");
const email_check_controller_1 = require("./email-check.controller");
const email_check_service_1 = require("./email-check.service");
let EmailCheckModule = class EmailCheckModule {
};
exports.EmailCheckModule = EmailCheckModule;
exports.EmailCheckModule = EmailCheckModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, tenant_api_key_module_1.TenantApiKeyModule],
        controllers: [email_check_controller_1.EmailCheckController],
        providers: [email_check_service_1.EmailCheckService]
    })
], EmailCheckModule);
//# sourceMappingURL=email-check.module.js.map