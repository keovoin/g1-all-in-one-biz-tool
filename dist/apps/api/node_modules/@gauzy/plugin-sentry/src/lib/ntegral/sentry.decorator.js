"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectSentryModuleConfig = exports.InjectSentry = void 0;
const injectDecoratorFactory_1 = require("./injectDecoratorFactory");
const sentry_constants_1 = require("./sentry.constants");
exports.InjectSentry = (0, injectDecoratorFactory_1.makeInjectableDecorator)(sentry_constants_1.SENTRY_TOKEN);
/**
 * Injects the Sentry Module config
 */
exports.InjectSentryModuleConfig = (0, injectDecoratorFactory_1.makeInjectableDecorator)(sentry_constants_1.SENTRY_MODULE_OPTIONS);
//# sourceMappingURL=sentry.decorator.js.map