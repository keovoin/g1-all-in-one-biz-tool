"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogSeederService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const changelog_seed_1 = require("./changelog.seed");
/**
 * Service dealing with help center based operations.
 *
 * @class
 */
let ChangelogSeederService = class ChangelogSeederService {
    /**
     * Create an instance of class.
     *
     * @constructs
     *
     */
    constructor(seeder) {
        this.seeder = seeder;
    }
    /**
     * Seed default change log.	 																																															*
     * @function
     */
    async createBasicDefault() {
        await this.seeder.tryExecute('Default Changelog', (0, changelog_seed_1.createChangelog)(this.seeder.dataSource));
    }
};
exports.ChangelogSeederService = ChangelogSeederService;
exports.ChangelogSeederService = ChangelogSeederService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.SeedDataService])
], ChangelogSeederService);
//# sourceMappingURL=changelog-seeder.service.js.map