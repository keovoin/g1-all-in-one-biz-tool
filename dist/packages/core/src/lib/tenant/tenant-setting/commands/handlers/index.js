"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const tenant_setting_get_handler_1 = require("./tenant-setting.get.handler");
const tenant_setting_save_handler_1 = require("./tenant-setting.save.handler");
const global_setting_get_handler_1 = require("./global-setting.get.handler");
const global_setting_save_handler_1 = require("./global-setting.save.handler");
exports.CommandHandlers = [
    tenant_setting_get_handler_1.TenantSettingGetHandler,
    tenant_setting_save_handler_1.TenantSettingSaveHandler,
    global_setting_get_handler_1.GlobalSettingGetHandler,
    global_setting_save_handler_1.GlobalSettingSaveHandler
];
//# sourceMappingURL=index.js.map