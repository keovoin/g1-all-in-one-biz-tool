import { CustomDecorator } from '@nestjs/common';
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
export declare const Public: () => CustomDecorator;
