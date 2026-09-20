"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensitiveRelations = exports.SENSITIVE_RELATIONS_ROOT_KEY = exports.SENSITIVE_RELATIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SENSITIVE_RELATIONS_KEY = 'SENSITIVE_RELATIONS_CONFIG';
exports.SENSITIVE_RELATIONS_ROOT_KEY = 'SENSITIVE_RELATIONS_ROOT_KEY';
const SensitiveRelations = (config, rootKey) => {
    const decorators = [(0, common_1.SetMetadata)(exports.SENSITIVE_RELATIONS_KEY, config)];
    if (rootKey) {
        decorators.push((0, common_1.SetMetadata)(exports.SENSITIVE_RELATIONS_ROOT_KEY, rootKey));
    }
    return (target, key, descriptor) => {
        decorators.forEach((decorator) => decorator(target, key, descriptor));
    };
};
exports.SensitiveRelations = SensitiveRelations;
//# sourceMappingURL=sensitive-relations.decorator.js.map