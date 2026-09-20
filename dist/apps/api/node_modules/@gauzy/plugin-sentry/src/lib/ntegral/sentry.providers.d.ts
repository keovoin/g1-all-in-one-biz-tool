import { Provider } from '@nestjs/common';
import { SentryModuleOptions } from './sentry.interfaces';
/**
 * Creates a provider for SentryService using the provided options.
 * @param {SentryModuleOptions} options - Options for configuring the Sentry module.
 * @returns {Provider} A provider for SentryService.
 */
export declare function createSentryProviders(options: SentryModuleOptions): Provider;
