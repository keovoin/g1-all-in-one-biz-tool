"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@gauzy/constants");
/**
 * Decorator that assigns metadata to the class/function using the
 * specified `PUBLIC_METHOD_METADATA`.
 * *
 * This metadata can be reflected using the `Reflector` class.
 *
 * Example: `@Public()`
 *
 *
 * @publicApi
 */
const Public = () => (0, common_1.SetMetadata)(constants_1.PUBLIC_METHOD_METADATA, true);
exports.Public = Public;
//# sourceMappingURL=public.decorator.js.map