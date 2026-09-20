"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gauzyToggleFeatures = exports.environment = void 0;
const tslib_1 = require("tslib");
/**
 * Public API Surface of @gauzy/config
 */
tslib_1.__exportStar(require("./lib/default-config"), exports);
tslib_1.__exportStar(require("./lib/database-helpers"), exports);
tslib_1.__exportStar(require("./lib/database"), exports);
tslib_1.__exportStar(require("./lib/config-loader"), exports);
tslib_1.__exportStar(require("./lib/config.module"), exports);
tslib_1.__exportStar(require("./lib/config.service"), exports);
var environment_1 = require("./lib/environments/environment");
Object.defineProperty(exports, "environment", { enumerable: true, get: function () { return environment_1.environment; } });
Object.defineProperty(exports, "gauzyToggleFeatures", { enumerable: true, get: function () { return environment_1.gauzyToggleFeatures; } });
tslib_1.__exportStar(require("./lib/environments/is-development"), exports);
tslib_1.__exportStar(require("./lib/environments/ienvironment"), exports);
//# sourceMappingURL=index.js.map