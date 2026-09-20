"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantService = void 0;
const crud_1 = require("./../core/crud");
class MerchantService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmMerchantRepository, mikroOrmMerchantRepository) {
        super(typeOrmMerchantRepository, mikroOrmMerchantRepository);
    }
    async findById(id, relations = []) {
        return await this.findOneByIdString(id, { relations });
    }
    async update(id, merchant) {
        return await this.save({ id, ...merchant });
    }
}
exports.MerchantService = MerchantService;
//# sourceMappingURL=merchant.service.js.map