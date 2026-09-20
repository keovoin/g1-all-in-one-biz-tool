"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractValidationPipe = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let AbstractValidationPipe = class AbstractValidationPipe extends common_1.ValidationPipe {
    constructor(options, targetTypes) {
        super(options);
        this.options = options;
        this.targetTypes = targetTypes;
    }
    async transform(value, metadata) {
        const targetType = this.targetTypes[metadata.type];
        if (!targetType) {
            return await super.transform(value, metadata);
        }
        return await super.transform(value, { ...metadata, metatype: targetType });
    }
};
exports.AbstractValidationPipe = AbstractValidationPipe;
exports.AbstractValidationPipe = AbstractValidationPipe = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], AbstractValidationPipe);
//# sourceMappingURL=abstract-validation.pipe.js.map