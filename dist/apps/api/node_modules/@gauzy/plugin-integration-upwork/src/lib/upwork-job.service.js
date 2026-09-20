"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkJobService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const UpworkApi = require("upwork-api");
const profile_js_1 = require("upwork-api/lib/routers/jobs/profile.js");
let UpworkJobService = class UpworkJobService {
    /*
     * Get job by key
     * This call returns the complete job object by job key. It's only available for users with `manage_recruiting` permissions within the team that the job is posted in.
     */
    async getJobProfileByKey(config, jobKey) {
        try {
            const api = new UpworkApi(config);
            const profile = new profile_js_1.Profile(api);
            return new Promise((resolve, reject) => {
                api.setAccessToken(config.accessToken, config.accessSecret, () => {
                    profile.getSpecific(jobKey, (error, data) => (error ? reject(error) : resolve(data)));
                });
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot get job by key');
        }
    }
};
exports.UpworkJobService = UpworkJobService;
exports.UpworkJobService = UpworkJobService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], UpworkJobService);
//# sourceMappingURL=upwork-job.service.js.map