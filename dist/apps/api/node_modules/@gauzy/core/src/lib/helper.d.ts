import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { ConfigService } from '@gauzy/config';
/**
 * Resolves the path for serving static files based on the environment and configuration.
 *
 * This function determines the root directory for serving static files depending on whether
 * the application is running in an Electron environment or a non-Electron (e.g., Node.js) environment.
 * It uses the configuration service to retrieve the asset options for custom public paths,
 * falling back to a default directory if no custom path is specified.
 *
 * @param config - An instance of `ConfigService` used to access application configurations.
 * @returns A promise resolving to an array of `ServeStaticModuleOptions` containing
 * the root path and serve root for serving static assets.
 */
export declare function resolveServeStaticPath(config: ConfigService): Promise<ServeStaticModuleOptions[]>;
