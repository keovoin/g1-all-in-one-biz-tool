"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Public API Surface of @gauzy/plugin-knowledge-base
 */
tslib_1.__exportStar(require("./lib/knowledge-base.plugin"), exports);
// Entity classes (exported for typing / read-only repository access by other plugins —
// e.g. the Documents plugin legacy import; consumers must NOT register them again).
tslib_1.__exportStar(require("./lib/entities"), exports);
//# sourceMappingURL=index.js.map