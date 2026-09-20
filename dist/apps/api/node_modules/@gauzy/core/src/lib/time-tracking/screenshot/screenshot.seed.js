"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomScreenshot = void 0;
const faker_1 = require("@faker-js/faker");
const fs_1 = require("fs");
const moment = require("moment");
const path = require("path");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../../core/entities/internal");
const random_seed_config_1 = require("./../../core/seeds/random-seed-config");
const util_1 = require("../../core/util");
const activity_seed_1 = require("./../activity/activity.seed");
/**
 * Generates random screenshots for a given tenant and organization within a specified time range.
 *
 * @param {Partial<ApplicationPluginConfig>} config - Configuration for asset paths and public paths.
 * @param {ID} tenantId - The unique identifier for the tenant.
 * @param {ID} organizationId - The unique identifier for the organization.
 * @param {Date} startedAt - The start timestamp for the time range.
 * @param {Date} stoppedAt - The end timestamp for the time range.
 * @returns {Promise<Screenshot[]>} - A promise that resolves with an array of generated screenshots.
 */
const createRandomScreenshot = async (config, tenantId, organizationId, employeeId, startedAt, stoppedAt) => {
    // Determine directories based on environment
    const isElectron = config_1.environment.isElectron;
    const isDist = __dirname.includes('dist');
    // Helper to resolve paths based on environment
    const resolvePath = (isDist, distPath, devPath) => isDist ? path.resolve(process.cwd(), distPath) : path.resolve(__dirname, devPath);
    // Resolve public directory
    const publicDir = (0, util_1.getApiPublicPath)();
    // Resolve asset public directory
    const assetPublicDir = isElectron
        ? path.resolve(config_1.environment.gauzyUserPath, 'public')
        : config.assetOptions?.assetPublicPath || publicDir;
    // Resolve asset path
    const assetPath = resolvePath(isDist, 'dist/apps/api/assets', '../../../apps/api/src/assets');
    // Resolve seed source directory
    const seedSourceDir = isElectron
        ? path.resolve(config_1.environment.gauzySeedPath, 'screenshots')
        : path.resolve(config.assetOptions.assetPath || assetPath, 'seed/screenshots');
    const screenshotsDir = path.join('screenshots', moment().format('YYYY/MM/DD'), tenantId, employeeId);
    const destinationDir = path.join(assetPublicDir, screenshotsDir);
    // Ensure the destination directory exists
    (0, fs_1.mkdirSync)(destinationDir, { recursive: true });
    // Retrieve the list of files from the source directory
    const fileList = await getList(seedSourceDir);
    const screenshots = [];
    // Generate random screenshots
    for (let i = 0; i < random_seed_config_1.randomSeedConfig.noOfScreenshotPerTimeSlot; i++) {
        // Get a random file from the file list
        const sourceFile = faker_1.faker.helpers.arrayElement(fileList);
        // Get the full path to the file
        const sourceFilePath = path.join(seedSourceDir, sourceFile);
        // Generate a unique file name for the screenshot
        const fileName = `screenshot-${moment().unix()}-${faker_1.faker.number.int(9999)}.png`;
        // Get the full path to the destination file
        const destFilePath = path.join(destinationDir, fileName);
        // Copy the screenshot file to the destination directory
        (0, fs_1.copyFileSync)(sourceFilePath, destFilePath);
        // Get the relative path to the destination file
        const relativePath = path.join(screenshotsDir, fileName);
        // Construct the screenshot metadata
        const screenshot = new internal_1.Screenshot();
        screenshot.tenantId = tenantId;
        screenshot.organizationId = organizationId;
        screenshot.fullUrl = relativePath;
        screenshot.file = relativePath;
        screenshot.thumb = relativePath;
        screenshot.thumbUrl = relativePath;
        screenshot.recordedAt = faker_1.faker.date.between({ from: startedAt, to: stoppedAt });
        screenshot.storageProvider = contracts_1.FileStorageProviderEnum.LOCAL;
        screenshot.isWorkRelated = faker_1.faker.helpers.arrayElement([true, false]);
        screenshot.apps = faker_1.faker.helpers.arrayElements(activity_seed_1.AppsNames, 2);
        screenshot.description = faker_1.faker.lorem.sentences({ min: 1, max: 3 });
        screenshots.push(screenshot);
    }
    return screenshots;
};
exports.createRandomScreenshot = createRandomScreenshot;
/**
 * Retrieves a list of files and directories from the specified directory.
 *
 * @param {string} dir - The path to the directory to read.
 * @returns {Promise<string[]>} - A promise that resolves with an array of file and directory names.
 * @throws {Error} - If the directory cannot be read, the promise is rejected.
 */
const getList = (dir) => {
    return new Promise((resolve, reject) => {
        (0, fs_1.readdir)(dir, (err, items) => {
            if (err) {
                reject(err); // Pass the error for better debugging
            }
            else {
                resolve(items); // Resolve with the list of items
            }
        });
    });
};
//# sourceMappingURL=screenshot.seed.js.map