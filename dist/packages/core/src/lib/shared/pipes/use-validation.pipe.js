"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseValidationPipe = UseValidationPipe;
const common_1 = require("@nestjs/common");
/**
 * Creates and applies a custom validation pipe with optional configuration.
 *
 * This function is a helper for applying NestJS's `ValidationPipe` with custom options
 * to a route or controller. It wraps the `UsePipes` decorator and makes it easier to
 * customize validation behavior.
 *
 * @param options - Optional `ValidationPipeOptions` to customize the validation behavior.
 * @returns A decorator that applies the `ValidationPipe` with the given options.
 */
function UseValidationPipe(options) {
    return (0, common_1.UsePipes)(new common_1.ValidationPipe(options ?? {}));
}
//# sourceMappingURL=use-validation.pipe.js.map