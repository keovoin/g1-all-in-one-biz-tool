"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixesForLoggers = void 0;
exports.LoggerDecorator = LoggerDecorator;
const common_1 = require("@nestjs/common");
exports.prefixesForLoggers = new Array();
function LoggerDecorator(prefix = '') {
    if (!exports.prefixesForLoggers.includes(prefix)) {
        exports.prefixesForLoggers.push(prefix);
    }
    return (0, common_1.Inject)(`LoggerService${prefix}`);
}
//# sourceMappingURL=logger.decorator.js.map