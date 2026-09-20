"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkOffersService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const UpworkApi = require("upwork-api");
const offers_js_1 = require("upwork-api/lib/routers/hr/freelancers/offers.js");
const applications_js_1 = require("upwork-api/lib/routers/hr/freelancers/applications.js");
let UpworkOffersService = class UpworkOffersService {
    /**
     * List freelancer’s offers
     * This call retrieves a list of offers received by a freelancer.
     */
    async getOffersListByFreelancer(config, status) {
        try {
            const api = new UpworkApi(config);
            const offers = new offers_js_1.Offers(api);
            const params = {
                status,
                offset: 0
            };
            return new Promise((resolve, reject) => {
                api.setAccessToken(config.accessToken, config.accessSecret, () => {
                    offers.getList(params, (error, data) => (error ? reject(error) : resolve(data)));
                });
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot get offers list');
        }
    }
    /**
     * Get freelancer’s offer
     * This call retrieves details about a specific offer received by a freelancer.
     */
    async getOfferByKey(config, offerKey) {
        try {
            const api = new UpworkApi(config);
            const offers = new offers_js_1.Offers(api);
            return new Promise((resolve, reject) => {
                api.setAccessToken(config.accessToken, config.accessSecret, () => {
                    offers.getSpecific(offerKey, (error, data) => (error ? reject(error) : resolve(data)));
                });
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot get freelancer offers');
        }
    }
    /**
     * List job applications as freelancer
     * This call lists all job applications made by a freelancer.
     */
    async getProposalLisByFreelancer(config, status) {
        try {
            const api = new UpworkApi(config);
            const applications = new applications_js_1.Applications(api);
            const params = {
                status,
                offset: 0
            };
            return new Promise((resolve, reject) => {
                api.setAccessToken(config.accessToken, config.accessSecret, () => {
                    applications.getList(params, (error, data) => (error ? reject(error) : resolve(data)));
                });
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot get proposal list');
        }
    }
    /**
     * Get job application as freelancer
     * This call retrieves details about a specific job application made by a freelancer.
     */
    getProposalBykey(config, applicationId) {
        try {
            const api = new UpworkApi(config);
            const applications = new applications_js_1.Applications(api);
            return new Promise((resolve, reject) => {
                api.setAccessToken(config.accessToken, config.accessSecret, () => {
                    applications.getSpecific(applicationId, (error, data) => error ? reject(error) : resolve(data));
                });
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot get proposal by applicationId');
        }
    }
};
exports.UpworkOffersService = UpworkOffersService;
exports.UpworkOffersService = UpworkOffersService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], UpworkOffersService);
//# sourceMappingURL=upwork-offers.service.js.map