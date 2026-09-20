import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppVersionInfo } from '@gauzy/contracts';
export declare class AppController {
    private readonly _configService;
    constructor(_configService: ConfigService);
    /**
     * This is a controller method for handling the HTTP GET request to the root endpoint ('/').
     * It is decorated with @HttpCode, @Get, and @Public decorators.
     */
    getAppStatus(): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    /**
     * Returns the running API's version and deployed commit, so clients (e.g. the
     * web UI footer) can display it and detect a version drift between the API and
     * the web app. Public — no secrets, safe to expose unauthenticated.
     *
     * @returns {IAppVersionInfo} `{ name: 'api', version, commit }`.
     */
    getAppVersion(): IAppVersionInfo;
    /**
     * Controller method to get application configurations.
     *
     * This method is decorated with @HttpCode, @Get decorators to specify HTTP response code
     * and handle GET requests for the '/configs' endpoint.
     *
     * @returns {Object} Object containing application configurations, including timezone, date, and settings.
     */
    getAppConfigs(): Promise<object>;
}
