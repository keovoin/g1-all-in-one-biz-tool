"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVER_ASYNC_INTEGRATION_NAME = exports.EverAsyncSettingName = void 0;
const contracts_1 = require("@gauzy/contracts");
/** Persisted names are stable; connector secrets are stored only as salted scrypt digests. */
var EverAsyncSettingName;
(function (EverAsyncSettingName) {
    EverAsyncSettingName["EVER_ASYNC_SERVER_URL"] = "EVER_ASYNC_SERVER_URL";
    /** Legacy scaffold setting; never used as a connector credential. */
    EverAsyncSettingName["EVER_ASYNC_API_TOKEN"] = "EVER_ASYNC_API_TOKEN";
    EverAsyncSettingName["EVER_ASYNC_USER_MAPPINGS"] = "EVER_ASYNC_USER_MAPPINGS";
    EverAsyncSettingName["EVER_ASYNC_PROJECT_IDS"] = "EVER_ASYNC_PROJECT_IDS";
    EverAsyncSettingName["EVER_ASYNC_KEY_ID"] = "EVER_ASYNC_KEY_ID";
    EverAsyncSettingName["EVER_ASYNC_SECRET_HASH"] = "EVER_ASYNC_SECRET_HASH";
    EverAsyncSettingName["IS_ENABLED"] = "IS_ENABLED";
})(EverAsyncSettingName || (exports.EverAsyncSettingName = EverAsyncSettingName = {}));
exports.EVER_ASYNC_INTEGRATION_NAME = contracts_1.IntegrationEnum.EVER_ASYNC;
//# sourceMappingURL=ever-async-setting.enum.js.map