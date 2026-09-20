"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const moment = require("moment");
const common_2 = require("@gauzy/common");
// Application version + deployed commit, embedded at Docker build time via
// GAUZY_APP_VERSION / GAUZY_APP_COMMIT env vars (see .deploy/*/Dockerfile).
// Empty when running from source without those set.
const APP_VERSION = process.env.GAUZY_APP_VERSION || '';
const APP_COMMIT = process.env.GAUZY_APP_COMMIT || '';
let AppController = class AppController {
    constructor(_configService) {
        this._configService = _configService;
    }
    /**
     * This is a controller method for handling the HTTP GET request to the root endpoint ('/').
     * It is decorated with @HttpCode, @Get, and @Public decorators.
     */
    async getAppStatus() {
        /**
         * Retrieve Application Name from Configuration Service
         *
         * This code snippet represents the retrieval of the application name from a configuration service.
         * It uses the `_configService` to get the application name and performs a type assertion to indicate
         * that the retrieved value is treated as a string.
         *
         * @returns {string} The application name retrieved from the configuration service.
         */
        const app_name = this._configService.get('app.app_name');
        // Return a JSON object with status and message
        return {
            status: common_1.HttpStatus.OK,
            message: `${app_name} API`
        };
    }
    /**
     * Returns the running API's version and deployed commit, so clients (e.g. the
     * web UI footer) can display it and detect a version drift between the API and
     * the web app. Public — no secrets, safe to expose unauthenticated.
     *
     * @returns {IAppVersionInfo} `{ name: 'api', version, commit }`.
     */
    getAppVersion() {
        return {
            name: 'api',
            version: APP_VERSION,
            commit: APP_COMMIT
        };
    }
    /**
     * Controller method to get application configurations.
     *
     * This method is decorated with @HttpCode, @Get decorators to specify HTTP response code
     * and handle GET requests for the '/configs' endpoint.
     *
     * @returns {Object} Object containing application configurations, including timezone, date, and settings.
     */
    async getAppConfigs() {
        /**
         * Get application configurations.
         */
        const configs = this._configService.get('app');
        /**
         * Get application settings.
         */
        const settings = this._configService.get('setting');
        /**
         * Return an object containing timezone, date, application configurations, and application settings.
         */
        return {
            /** The guessed timezone using moment.js. */
            timezone: moment.tz.guess(),
            /** The current date and time using moment.js. */
            date: moment().format(),
            /** Application-specific configurations obtained from the configuration service. */
            ...configs,
            /** Application settings obtained from the configuration service. */
            ...settings
        };
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK) // Set the HTTP response code to 200 OK
    ,
    (0, common_1.Get)('/') // Define that this method handles GET requests for the root endpoint
    ,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AppController.prototype, "getAppStatus", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('/version'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], AppController.prototype, "getAppVersion", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK) // Set the HTTP response code to 200 OK
    ,
    (0, common_1.Get)('/configs') // Define that this method handles GET requests for the '/configs' endpoint
    ,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AppController.prototype, "getAppConfigs", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    (0, common_2.Public)() // This seems to be a custom decorator indicating that this controller's endpoints are public
    ,
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], AppController);
//# sourceMappingURL=app.controller.js.map