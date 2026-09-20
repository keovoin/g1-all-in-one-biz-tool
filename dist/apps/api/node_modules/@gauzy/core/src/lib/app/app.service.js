"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
const seed_data_service_1 = require("../core/seeds/seed-data.service");
const user_service_1 = require("../user/user.service");
let AppService = class AppService {
    constructor(seedDataService, userService) {
        this.seedDataService = seedDataService;
        this.userService = userService;
        this.userCount = 0;
    }
    /**
     * Seed DB if no users exists (for simplicity and safety we only re-seed DB if no users found)
     * TODO: this should actually include more checks, e.g. if schema migrated and many other things
     */
    async seedDBIfEmpty() {
        this.userCount = await this.userService.countAll();
        console.log(chalk.magenta(`Found ${this.userCount} users in DB`));
        if (this.userCount > 0) {
            // If users already exist, skip default seeding
            return;
        }
        await this.seedDataService.runDefaultSeed(true);
    }
    /*
     * Seed DB for Demo server if empty
     */
    async seedDemoIfEmpty() {
        const isDemo = config_1.environment.demo === true;
        console.log(chalk.magenta(`Demo mode is ${isDemo ? 'enabled' : 'disabled'}. Found ${this.userCount} users in DB.`));
        // Only run demo seed if no users exist and demo mode is enabled
        if (this.userCount === 0 && isDemo) {
            await this.seedDataService.runDemoSeed();
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [seed_data_service_1.SeedDataService, user_service_1.UserService])
], AppService);
//# sourceMappingURL=app.service.js.map