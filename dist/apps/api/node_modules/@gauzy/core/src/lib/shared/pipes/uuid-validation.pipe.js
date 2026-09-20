"use strict";
// Code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDValidationPipe = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
/**
 * UUID Validation Pipe
 *
 * Validates UUID passed in request parameters.
 */
let UUIDValidationPipe = class UUIDValidationPipe {
    /**
     * Instance of class-validator
     *
     * Can not be easily injected, and there's no need to do so as we
     * only use it for uuid validation method.
     */
    /**
     * When user requests an entity with invalid UUID we must return 404
     * error before reaching into the database.
     */
    transform(value, metadata) {
        if ((0, utils_1.isEmpty)(value)) {
            throw new common_1.NotFoundException('Validation failed (uuid is expected)');
        }
        if (!(0, class_validator_1.isUUID)(value)) {
            throw new common_1.NotAcceptableException('Validation failed (valid uuid is expected)');
        }
        return value;
    }
};
exports.UUIDValidationPipe = UUIDValidationPipe;
exports.UUIDValidationPipe = UUIDValidationPipe = tslib_1.__decorate([
    (0, common_1.Injectable)()
], UUIDValidationPipe);
//# sourceMappingURL=uuid-validation.pipe.js.map