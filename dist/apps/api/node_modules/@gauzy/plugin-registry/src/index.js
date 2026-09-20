"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./lib/plugin-registry.module"), exports);
tslib_1.__exportStar(require("./lib/registry.plugin"), exports);
// Export all entities, services, controllers, etc.
tslib_1.__exportStar(require("./lib/domain"), exports);
tslib_1.__exportStar(require("./lib/infrastructure"), exports);
tslib_1.__exportStar(require("./lib/shared"), exports);
//# sourceMappingURL=index.js.map